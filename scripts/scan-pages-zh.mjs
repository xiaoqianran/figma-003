/**
 * scan-pages-zh.mjs — fail if src/pages has user-visible Latin not on allowlist.
 *
 * Extracts:
 *  - JSX text nodes (multiline-aware)
 *  - standalone pure-text children lines
 *  - toast info/success/error/warning string/template args
 *  - placeholder / title / aria-label string props
 *
 * Token-scans even when Chinese is present (mixed strings).
 * Hard-bans (demo)/(Demo) — use （演示） instead.
 *
 * Exit 0 when clean; exit 1 and print hits otherwise.
 * Optional: SCAN_OUT=/path writes full inventory.
 * Self-test: node scripts/scan-pages-zh.mjs --self-test
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const pagesDir = path.join(root, 'src/pages')

/** Brand / person / plate / product tokens allowed in Latin */
const ALLOW_TOKENS = new Set([
  'GodyX', 'GODY', 'Gody', 'VISA', 'Visa', 'GodyBlack', 'Comfort', 'XL',
  'GodyCash', 'GodyPass', 'Pass', 'Cash', 'Pool', 'Eats',
  'Push', 'Puttichai', 'Jack', 'John', 'Sarah', 'Alex', 'Chen',
  'Wi', 'Fi', 'Facebook', 'Twitter', 'Google',
  'NIO', 'ET7', 'XPeng', 'Tesla', 'BYD', 'Camry', 'SUV',
  'Wang', 'Lei', 'Fang', 'Zhao', 'Min', 'Li', 'Ming', 'Sun', 'Hao', 'Yu', 'Liu',
  'Auto', 'L9', 'PM', 'AM', 'SMS', 'WiFi',
  // isolated technical status enums when shown raw in demo overlays
  'upcoming', 'completed', 'cancelled', 'progress', 'in',
])

/** Full multi-word allow phrases (normalized) */
const ALLOW_PHRASES = new Set([
  'gody black', 'comfort xl', 'gody cash', 'gody pass', 'gody eats',
  'push puttichai', 'alex chen', 'wi-fi', 'wi fi', 'nio et7', 'li auto l9',
  'push · 4.93', 'jack · 4.93', 'demo.user@gody.example',
])

const BANNED_LATIN = ['(demo)', '(Demo)', '(DEMO)']

function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function isAllowedToken(tok) {
  if (!tok) return true
  if (ALLOW_TOKENS.has(tok)) return true
  if (ALLOW_TOKENS.has(tok.toLowerCase())) return true
  // pure digits / currency-ish
  if (/^[\d.]+$/.test(tok)) return true
  // email-ish
  if (tok.includes('@')) return true
  // vehicle plates / codes: 9HTR789
  if (/^[A-Z0-9]{4,}$/i.test(tok) && /\d/.test(tok) && /[A-Za-z]/.test(tok)) return true
  // short ALLCAPS acronyms (ETA, API, SUV, SMS, AM, PM, XL)
  if (/^[A-Z]{2,4}$/.test(tok)) return true
  // camelCase / PascalCase API ids (bookTrip, updateTripStatus, onNavigate) — not UI copy
  if (/^[a-z]+[A-Z][A-Za-z0-9]*$/.test(tok)) return true
  if (/^[A-Z][a-z]+(?:[A-Z][a-z]+)+$/.test(tok) && /(Page|Props|Modal|Card|Context)$/.test(tok)) return true
  // DemoState compound product name → not allowed (must be 演示状态); handled as disallowed
  // single letter
  if (tok.length === 1) return true
  return false
}

/**
 * Extract Latin tokens from a UI string (after removing ${...} template holes).
 * Returns list of disallowed tokens / banned phrases.
 */
function scanUiString(s) {
  const hits = []
  if (!s || !/[A-Za-z]/.test(s)) return hits

  for (const ban of BANNED_LATIN) {
    if (s.includes(ban)) hits.push(`BANNED:${ban}`)
  }

  // remove template expressions for token scan
  let body = s.replace(/\$\{[^}]*\}/g, ' ')
  // normalize
  body = body.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')

  // phrase allow
  const lower = body.toLowerCase()
  for (const ph of ALLOW_PHRASES) {
    if (lower.includes(ph)) {
      // blank out allowed phrase letters so they don't re-hit as tokens
      body = body.replace(new RegExp(ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), ' ')
    }
  }

  // Latin letter sequences (words)
  const words = body.match(/[A-Za-z][A-Za-z0-9._-]*/g) || []
  for (const w of words) {
    // skip pure style/class fragments
    if (/^(px|em|rem|vh|vw|rgb|rgba|var|calc|deg|ms|fr)$/i.test(w)) continue
    if (isAllowedToken(w)) continue
    // skip very short technical
    if (w.length <= 2) continue
    hits.push(w)
  }
  return hits
}

function extractStrings(src) {
  /** @type {{kind:string, text:string, line:number}[]} */
  const out = []
  const lines = src.split('\n')

  // 1) Toast call args on each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!/\b(info|success|error|warning)\s*\(/.test(line)) continue
    const m = line.match(/\b(info|success|error|warning)\s*\((.*)\)\s*;?\s*$/)
    if (!m) continue
    const args = m[2]
    const strRe = /(['"`])((?:\\.|(?!\1).)*)\1/g
    let sm
    while ((sm = strRe.exec(args))) {
      const text = sm[2].replace(/\\n/g, ' ')
      // skip pure CSS
      if (/^(#|rgba?\(|rotate\(|linear-gradient|[\d.]+px)/.test(text)) continue
      if (text.includes('styles.') || text.includes('rgba(')) continue
      out.push({ kind: 'toast', text, line: i + 1 })
    }
  }

  // 2) placeholder / title / aria-label = (skip template holes)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const propRe = /(?:placeholder|title|aria-label|confirmText|cancelText)=\{?(?:['"`])([^'"`]+)['"`]\}?/g
    let m
    while ((m = propRe.exec(line))) {
      if (m[1].includes('${')) continue
      out.push({ kind: 'prop', text: m[1], line: i + 1 })
    }
  }

  // 3) JSX text nodes multiline
  const re = />([^<>{]{1,240})</gs
  let m
  while ((m = re.exec(src))) {
    const text = m[1].replace(/\s+/g, ' ').trim()
    if (!text) continue
    // skip code-looking spans
    if (/const |function |interface |return \(|useState|React\./.test(text)) continue
    if (/[;{}=]/.test(text) && !/（|）/.test(text)) continue
    if (/^\d+\s*&&/.test(text) || /\b0\s*&&/.test(text)) continue
    if (/^[\d\s:.\-+%$,¥×·~m/]+$/i.test(text)) continue
    const line = src.slice(0, m.index).split('\n').length
    out.push({ kind: 'jsx', text, line })
  }

  // 4) Standalone pure-text UI lines (keyboard keys, CTAs) — not prop identifiers
  const PROP_LINE = /^(destructive|selected|disabled|open|true|false|null|undefined|return)$/i
  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].trim()
    if (!s) continue
    if (/[<>{}();=:'"`]/.test(s)) continue
    if (s.endsWith(',')) continue
    if (PROP_LINE.test(s)) continue
    if (!/^[+A-Za-z\u4e00-\u9fff]/.test(s)) continue
    if (/[\u4e00-\u9fff]/.test(s) && !/[A-Za-z]/.test(s)) continue
    if (/^[A-Za-z]/.test(s) || /\(demo\)/i.test(s)) {
      out.push({ kind: 'line', text: s, line: i + 1 })
    }
  }

  // 5) Quoted UI field strings: title: '...', desc: '...', label: '...'
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fr = /(?:title|desc|label|message|subtitle|heading|placeholder)\s*:\s*(['"`])([^'"`]+)\1/g
    let fm
    while ((fm = fr.exec(line))) {
      out.push({ kind: 'field', text: fm[2], line: i + 1 })
    }
  }

  return out
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name)
    const st = fs.statSync(fp)
    if (st.isDirectory()) walk(fp, files)
    else if (name.endsWith('.tsx')) files.push(fp)
  }
  return files
}

export function scanSource(src, fileLabel = 'fixture') {
  const clean = stripComments(src)
  const strings = extractStrings(clean)
  const hits = []
  for (const { kind, text, line } of strings) {
    const bad = scanUiString(text)
    for (const b of bad) {
      hits.push({ file: fileLabel, line, kind, token: b, text: text.slice(0, 120) })
    }
  }
  return hits
}

function scanRepo() {
  if (!fs.existsSync(pagesDir)) {
    console.error('pages dir missing:', pagesDir)
    return { hits: [], files: 0 }
  }
  const files = walk(pagesDir)
  const hits = []
  for (const fp of files) {
    const rel = path.relative(root, fp)
    const src = fs.readFileSync(fp, 'utf8')
    hits.push(...scanSource(src, rel))
  }
  // de-dupe
  const seen = new Set()
  const uniq = []
  for (const h of hits) {
    const k = `${h.file}:${h.line}:${h.token}:${h.text}`
    if (seen.has(k)) continue
    seen.add(k)
    uniq.push(h)
  }
  return { hits: uniq, files: files.length }
}

function selfTest() {
  const bad = `
    const X = () => {
      info('测试', '编辑上车点 (demo)');
      return <div>Confirm</div>;
    };
  `
  const good = `
    const X = () => {
      info('测试', '编辑上车点（演示）');
      return <div>确认</div>;
    };
  `
  const h1 = scanSource(bad, 'self-bad')
  const h2 = scanSource(good, 'self-good')
  const ok1 = h1.some((h) => String(h.token).includes('demo') || h.token === 'Confirm' || h.token === 'BANNED:(demo)')
  const ok2 = h2.length === 0
  console.log('self-test inject (demo):', ok1 ? 'FAIL as expected (' + h1.length + ' hits)' : 'UNEXPECTED PASS')
  console.log('self-test （演示）:', ok2 ? 'PASS' : 'UNEXPECTED FAIL ' + JSON.stringify(h2.slice(0, 5)))
  if (!ok1 || !ok2) {
    process.exit(1)
  }
  console.log('self-test OK')
  process.exit(0)
}

function main() {
  if (process.argv.includes('--self-test')) {
    selfTest()
    return
  }

  const { hits, files } = scanRepo()
  const outPath = process.env.SCAN_OUT || process.env.SCRATCH
    ? path.join(process.env.SCAN_OUT || process.env.SCRATCH, 'en-inventory.txt')
    : null

  const report = [
    `=== scan-pages-zh ===`,
    `files=${files}`,
    `hits=${hits.length}`,
    '',
    ...hits.map((h) => `${h.file}:${h.line} [${h.kind}] ${h.token} :: ${h.text}`),
    hits.length ? '' : '(clean)',
  ].join('\n')

  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, report + '\n')
    console.log('Wrote', outPath)
  }

  console.log(`scan-pages-zh: files=${files} hits=${hits.length}`)
  if (hits.length) {
    hits.slice(0, 40).forEach((h) => {
      console.log(`  ✗ ${h.file}:${h.line} [${h.kind}] ${h.token} :: ${h.text}`)
    })
    if (hits.length > 40) console.log(`  … +${hits.length - 40} more`)
    process.exit(1)
  }
  console.log('  ✓ no disallowed Latin UI tokens in src/pages')
  process.exit(0)
}

main()
