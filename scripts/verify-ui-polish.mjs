/**
 * verify-ui-polish.mjs — asserts ui-ux-pro-max-driven shipped design system
 * Source of truth: design-system/gody-studio/MASTER.md
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const failures = []
const passes = []

function read(rel) {
  const p = path.join(root, rel)
  if (!fs.existsSync(p)) {
    failures.push(`MISSING file: ${rel}`)
    return ''
  }
  return fs.readFileSync(p, 'utf8')
}

function assert(cond, msg) {
  if (cond) passes.push(msg)
  else failures.push(msg)
}

function hasRule(css, selector, pseudo) {
  const re = new RegExp(
    `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${pseudo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
  )
  return re.test(css)
}

// --- 0. ui-ux-pro-max design system artifact in-repo ---
const master = read('design-system/gody-studio/MASTER.md')
assert(master.includes('#CA8A04') || master.includes('#ca8a04') || master.includes('CA8A04'), 'MASTER.md defines CTA #CA8A04')
assert(master.includes('#1C1917') || master.includes('1C1917'), 'MASTER.md defines primary #1C1917')
assert(master.includes('#FAFAF9') || master.includes('FAFAF9'), 'MASTER.md defines background #FAFAF9')
assert(master.includes('GODY Studio') || master.includes('Design System'), 'MASTER.md is GODY Studio system')
assert(fs.existsSync(path.join(root, 'design-system/gody-studio/pages')), 'page override dir exists')

// --- 1. Shipped tokens map MASTER ---
const indexCss = read('src/index.css')
assert(indexCss.includes('ui-ux-pro-max') || indexCss.includes('design-system/gody-studio'), 'index.css cites ui-ux-pro-max / MASTER')
assert(indexCss.includes('--color-cta:') || indexCss.includes('--color-cta: '), 'index.css has --color-cta')
assert(/--color-cta:\s*#ca8a04/i.test(indexCss), 'shipped --color-cta is #ca8a04')
assert(/--color-primary:\s*#1c1917/i.test(indexCss), 'shipped --color-primary is #1c1917')
assert(/--color-background:\s*#fafaf9/i.test(indexCss), 'shipped --color-background is #fafaf9')
assert(/--color-text:\s*#0c0a09/i.test(indexCss), 'shipped --color-text is #0c0a09')
assert(indexCss.includes('--space-md') || indexCss.includes('--space-lg'), 'spacing scale from MASTER')
assert(indexCss.includes('lab-app') && indexCss.includes('lab-workspace'), 'lab shell classes present')
assert(indexCss.includes('backdrop-filter') || indexCss.includes('glass'), 'glassmorphism cues in lab chrome')
assert(hasRule(indexCss, '.tb-btn', ':hover') || hasRule(indexCss, '.lab-btn', ':hover'), 'lab btn hover')
assert(hasRule(indexCss, '.tb-btn', ':focus-visible') || hasRule(indexCss, '.lab-btn', ':focus-visible'), 'lab btn focus-visible')
assert(indexCss.includes('.gody-toast') && indexCss.includes('.gody-modal-panel'), 'toast/modal styles')
assert(indexCss.includes('--device-w: 375px') || indexCss.includes('--device-w:375px'), 'device width 375')
assert(indexCss.includes('--device-h: 812px') || indexCss.includes('--device-h:812px'), 'device height 812')
assert(indexCss.includes('prefers-reduced-motion'), 'reduced motion respect (checklist)')
assert(indexCss.includes('DM Sans') || read('index.html').includes('DM+Sans') || read('index.html').includes('DM Sans'), 'DM Sans font (MASTER typography)')

// --- 2. Mobile primitives ---
const protoCss = read('src/styles/prototypes.css')
assert(protoCss.includes('width: 375px') && protoCss.includes('height: 812px'), 'mobile-frame 375×812')
assert(!/height:\s*858px/.test(protoCss), 'no 858 overflow frame')
assert(hasRule(protoCss, '.primary-btn', ':hover'), 'primary-btn hover')
assert(hasRule(protoCss, '.primary-btn', ':focus-visible'), 'primary-btn focus-visible')
assert(hasRule(protoCss, '.primary-btn', ':active'), 'primary-btn active')
assert(protoCss.includes('--color-cta') || /#ca8a04/i.test(protoCss), 'primary CTA uses MASTER gold')
assert(hasRule(protoCss, '.vehicle-card', ':hover'), 'vehicle-card hover')
assert(hasRule(protoCss, '.trip-card', ':hover'), 'trip-card hover')
assert(hasRule(protoCss, '.payment-card', ':hover'), 'payment-card hover')

// --- 3. Components wired ---
const modalSrc = read('src/components/ui/Modal.tsx')
assert(modalSrc.includes('gody-modal-backdrop') && modalSrc.includes('onClose'), 'Modal wired')
const toastSrc = read('src/components/ui/Toast.tsx')
assert(toastSrc.includes('gody-toast') && toastSrc.includes('showToast'), 'Toast wired')

// --- 4. App shell ---
const app = read('src/App.tsx')
assert(app.includes('lab-app') && app.includes('lab-workspace'), 'App lab shell')
assert(app.includes('prototype/') || app.includes('`/prototype/'), 'prototype routes')
assert(app.includes('hardware-frame') || app.includes('showFrame'), 'device frame')

// --- 5. Flagship pages ---
const home = read('src/pages/core/HomePage.tsx')
assert(home.includes('onNavigate') && home.includes('core-search1'), 'Home nav search')
assert(home.includes('booking-choose-car'), 'Home nav choose-car')
assert(home.includes('home-vehicles') || home.includes('Available near you'), 'Home vehicles section')
assert(home.includes('maxHeight') || home.includes('flex'), 'Home layout fit constraints')

const login = read('src/pages/auth/LoginPage.tsx')
assert(login.includes('onNavigate') && login.includes('core-home'), 'Login → home')
assert(login.includes('success'), 'Login toast')
const loginCss = read('src/pages/auth/LoginPage.module.css')
assert(/#ca8a04/i.test(loginCss) || loginCss.includes('color-cta'), 'Login CTA uses MASTER gold')

const chooseCar = read('src/pages/booking/ChooseCarPage.tsx')
assert(chooseCar.includes('primary-btn') && chooseCar.includes('booking-confirm-pickup1'), 'ChooseCar CTA+nav')
assert(!/height:\s*858/.test(chooseCar), 'ChooseCar not 858 tall')
assert(chooseCar.includes('choose-car-schedule') || chooseCar.includes('Schedule'), 'Schedule CTA')

const trips = read('src/pages/trips/YourTripsUpcomingPage.tsx')
assert(trips.includes('onNavigate') && trips.includes('primary-btn'), 'Trips CTA')
assert(trips.includes('TripCard'), 'Trips TripCard')

const main = read('src/main.tsx')
assert(main.includes('ToastProvider') && main.includes('HashRouter'), 'main providers')

// --- 6. Pages: no stray English UI text (multiline-aware, brand allowlist) ---
const ALLOW_EXACT = new Set([
  'GodyX', 'GODY', 'Gody', 'VISA', 'Visa', 'Gody Black', 'Comfort XL', 'Gody Cash', 'Gody pass', 'Gody Pass',
  'Push Puttichai', 'Alex Chen', 'Wi-Fi', 'Wi‑Fi', 'Facebook', 'Twitter', 'Google', 'Eats', 'Pool',
  'Push · 4.93', 'Jack · 4.93', '9HTR789', 'Push', 'Jack', 'John', 'Sarah',
  'Gody Eats', 'demo.user@gody.example',
  '🚗 GodyX', '🍽️ Eats', '🚗 Trips', '123', '···· 4242', '.... 4242',
])
const ALLOW_PREFIX = /^(Push|Jack|Alex|John|Sarah|Gody|GODY|VISA|Visa|NIO|XPeng|Tesla|BYD|Wi|Li |Wang |Chen |Zhao |Sun |Liu )/
const BANNED_SNIPPETS = [
  'Schedule a trip', 'Need help with this trip', 'Manage your profile', 'Where are you going',
  'Good morning', 'Welcome back', 'Confirm your pick-up', 'Your trips', 'Book a ride',
  'Choose a trip', 'Switch payment method', 'I want to switch my payment', 'Relax with real',
  'You are here', 'Logged in:', 'Demo Perks', 'Seed 3 sample trips', 'Create Test Active',
  'Mark paid', 'view in upcoming', 'Tap to view', 'My Trips Hub',
  // residual UI that previously slipped past same-line-only scan
  'Add Payment methods', 'Add promo codes', 'I was involved in accident', 'Active trip to',
  'search prefilled', 'Current lead:', 'updating live', 'Gift to:', "Can't send",
  'Balance:', 'Gody Pass:', 'Promo:', 'Gifts:', 'Eats:',
]
const pagesDir = path.join(root, 'src/pages')
const enNodes = []
function looksLikeCode(s) {
  return /(?:const |let |var |function |return \(|interface |type |useState|useRef|useEffect|React\.|Props|status ===|onNavigate|void;|=\s*\(|=>)/.test(s)
    || /[;{}=]/.test(s)
    || /^\d+\s*&&/.test(s)
    || /^(padding|margin|color|background|fontSize|border|display|flex|width|height|cursor|position|top|left|right|bottom|alignItems|justifyContent|borderRadius|boxShadow|marginBottom|marginTop|fontWeight|opacity|zIndex|overflow|gap|minWidth|maxWidth|minHeight|maxHeight|flexDirection|flexWrap|flexShrink|lineHeight|letterSpacing|textAlign|whiteSpace|objectFit|transform|transition|animation|outline)\b/i.test(s)
}
function isDisallowedUiText(s) {
  if (!s || /[\u4e00-\u9fff]/.test(s)) return false
  if (!/[A-Za-z]{3,}/.test(s)) return false
  if (/^[\d\s:.\-+%$,¥×·~m•·/]+$/i.test(s)) return false
  if (ALLOW_EXACT.has(s) || ALLOW_PREFIX.test(s)) return false
  const core = s.replace(/^[\W\d🚗🍽🎫+]+/, '').trim()
  if (ALLOW_EXACT.has(core) || (core && ALLOW_PREFIX.test(core))) return false
  if (s.includes('status===') || s.includes('t.status') || s.includes('activeTrip')) return false
  if (s.startsWith('0 &&')) return false
  if (s.includes('@') && s.includes('.')) return false
  if (looksLikeCode(s)) return false
  // pure single technical token
  if (/^[a-z][a-zA-Z0-9]*$/.test(s) && !/^(space|return|confirm|cancel|submit|continue|back|next|done|save|close)$/i.test(s)) return false
  return true
}
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name)
    const st = fs.statSync(fp)
    if (st.isDirectory()) walk(fp)
    else if (name.endsWith('.tsx')) {
      const raw = fs.readFileSync(fp, 'utf8')
      const t = raw
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/(^|[^:])\/\/.*$/gm, '$1')
      const rel = path.relative(root, fp)

      // A) JSX text nodes — multiline allowed (no nested tags / {expr} inside)
      // Filter code spans that sneak between generic `>` and later `<`.
      const re = />([^<>{]{1,200})</gs
      let m
      while ((m = re.exec(t))) {
        let s = m[1].replace(/&nbsp;|&amp;|&lt;|&gt;/g, ' ').replace(/\s+/g, ' ').trim()
        if (!isDisallowedUiText(s)) continue
        // extra guard: UI text rarely contains commas of destructuring or dots of module paths
        if (/,/.test(s) && !/\d/.test(s) && s.split(',').length > 2) continue
        if (/\.tsx|\.css|module\.|from '/.test(s)) continue
        enNodes.push({ file: rel, text: s })
      }

      // B) Standalone pure-English UI label lines (keyboard keys / CTAs / multiword copy)
      // Must be pure display text — no code punctuation (colons, quotes, commas-as-syntax).
      for (const line of t.split('\n')) {
        const s = line.trim()
        if (!s) continue
        if (/[<>{}();=:'"`]/.test(s)) continue
        if (s.endsWith(',')) continue
        // skip camelCase/destructure identifier lists: user, activeTrip, bookTrip
        if (/,/.test(s) && s.split(',').every((p) => /^[A-Za-z_$][\w$]*\s*$/.test(p.trim()) || !p.trim())) continue
        if (!/^[+A-Za-z]/.test(s)) continue
        if (/[\u4e00-\u9fff]/.test(s)) continue
        if (ALLOW_EXACT.has(s) || ALLOW_PREFIX.test(s)) continue
        if (looksLikeCode(s)) continue
        if (/^(return|true|false|null|undefined|export default|destructive|selected)$/i.test(s)) continue
        if (/^[A-Z][a-zA-Z0-9]+$/.test(s) && /Page$|Props$|Modal$/.test(s)) continue
        // UI-ish: short CTAs, keyboard keys, multiword phrases, + Add …
        if (/^(space|return|Confirm|Cancel|Submit|Continue|Back|Next|Done|Save|Close)$/i.test(s)
          || /^\+\s*[A-Za-z]/.test(s)
          || (/^[A-Za-z][A-Za-z0-9 +.'’!?%\-/]{2,80}$/.test(s) && /\s/.test(s) && /[a-z]/.test(s))) {
          enNodes.push({ file: rel, text: `LINE: ${s}` })
        }
      }

      // C) English UI labels glued before expressions on a JSX line:  Balance: <strong>… / Active trip to <strong>
      for (const line of t.split('\n')) {
        if (!line.includes('{') && !line.includes('<')) continue
        if (/^\s*(const|let|var|function|import|export|interface|type|if|return|for|while)\b/.test(line.trim())) continue
        // label then tag: Balance: <strong
        let lm
        const labelTag = /(?:^|>)\s*([A-Za-z][A-Za-z0-9 +.'’!?:%\-]{1,50}?)\s*</g
        while ((lm = labelTag.exec(line))) {
          const s = lm[1].replace(/\s+/g, ' ').trim().replace(/[•·|,]+$/, '').trim()
          if (/^(Balance:|Gift to:|Current lead:|Active trip to|Logged in:|Gody Pass:|Promo:|Gifts:|Eats:)$/i.test(s)
            || (isDisallowedUiText(s) && /:$/.test(s))) {
            enNodes.push({ file: rel, text: `LABEL: ${s}` })
          }
        }
      }

      // D) Banned phrases in quote or on UI lines (not identifiers like RequestingPage)
      for (const snip of BANNED_SNIPPETS) {
        const esc = snip.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const asQuote = new RegExp("['\"`]" + esc, 'i')
        const asJsxStart = new RegExp('>[^<{\\n]*' + esc, 'i')
        const real = t.split('\n').some((line) => {
          if (/^\s*(import |export |interface |type |const |function |\/\/)/.test(line)) return false
          if (asQuote.test(line) || asJsxStart.test(line)) return true
          // plain UI text line containing the phrase (not camelCase glue)
          if (line.includes(snip) && !new RegExp('[A-Za-z]' + esc).test(line) && !new RegExp(esc + '[A-Za-z]').test(line)) {
            return true
          }
          return false
        })
        if (real) enNodes.push({ file: rel, text: `BANNED_SNIPPET: ${snip}` })
      }
    }
  }
}
if (fs.existsSync(pagesDir)) walk(pagesDir)
{
  const seen = new Set()
  const uniq = []
  for (const n of enNodes) {
    const k = n.file + '\0' + n.text
    if (seen.has(k)) continue
    seen.add(k)
    uniq.push(n)
  }
  enNodes.length = 0
  enNodes.push(...uniq)
}
assert(enNodes.length === 0, `pages have no disallowed English UI nodes (found ${enNodes.length})`)
if (enNodes.length) {
  enNodes.slice(0, 30).forEach((n) => failures.push(`${n.file}: ${n.text}`))
}
// status enums must remain English technical values
const sampleTrip = read('src/pages/trips/YourTripsUpcomingPage.tsx')
assert(sampleTrip.includes("status === 'upcoming'") || sampleTrip.includes("status === 'in-progress'"), 'trip status enums remain English technical values')
assert(sampleTrip.includes('我的行程'), 'YourTripsUpcoming uses Chinese title')
assert(read('src/pages/core/HomePage.tsx').includes('早上好') || read('src/pages/core/HomePage.tsx').includes('您要去哪里'), 'Home Chinese labels')
assert(read('src/pages/auth/LoginPage.tsx').includes('欢迎回来') || read('src/pages/auth/LoginPage.tsx').includes('继续'), 'Login Chinese labels')
assert(read('src/pages/booking/ChooseCarPage.tsx').includes('选择出行方式') || read('src/pages/booking/ChooseCarPage.tsx').includes('预约'), 'ChooseCar Chinese labels')
assert(read('src/pages/booking/RequestingPage.tsx').includes('请求司机') || read('src/pages/booking/RequestingPage.tsx').includes('预计上车'), 'Requesting Chinese labels')
assert(read('src/pages/account/AccountIndexPage.tsx').includes('账户') || read('src/pages/account/AccountIndexPage.tsx').includes('已登录'), 'Account Chinese labels')
assert(read('src/pages/payment/SelectPaymentPage.tsx').includes('添加支付方式') || read('src/pages/payment/SelectPaymentPage.tsx').includes('使用此支付方式'), 'SelectPayment Chinese labels')
assert(read('src/pages/payment/ConfirmPaymentPage.tsx').includes('确认'), 'ConfirmPayment Chinese CTA')
assert(read('src/pages/map/MapHomePage.tsx').includes('进行中') || read('src/pages/map/MapHomePage.tsx').includes('行程'), 'MapHome Chinese labels')
assert(read('src/pages/trips/TripDetailHelpPage.tsx').includes('事故'), 'TripDetailHelp Chinese help option')
assert(read('src/pages/core/Search1Page.tsx').includes('空格') && read('src/pages/core/Search1Page.tsx').includes('换行'), 'Search1 keyboard Chinese keys')
assert(read('src/pages/core/Search2Page.tsx').includes('空格') && read('src/pages/core/Search2Page.tsx').includes('换行'), 'Search2 keyboard Chinese keys')
assert(read('src/pages/booking/RequestingPage.tsx').includes('当前领先司机') || read('src/pages/booking/RequestingPage.tsx').includes('实时更新'), 'Requesting live status Chinese')
assert(read('src/pages/account/AccountIndexPage.tsx').includes('余额'), 'Account balance Chinese label')
assert(read('src/pages/account/ProfilePage.tsx').includes('赠送给') || read('src/pages/account/ProfilePage.tsx').includes('余额'), 'Profile gift modal Chinese')

const summary = { passed: passes.length, failed: failures.length, passes, failures, enNodesSample: enNodes.slice(0, 10) }
console.log('=== ui-ux-pro-max GODY Studio verification ===')
console.log(`PASS: ${passes.length}`)
console.log(`FAIL: ${failures.length}`)
if (failures.length) {
  console.log('\nFailures:')
  failures.forEach((f) => console.log('  ✗', f))
} else {
  passes.forEach((p) => console.log('  ✓', p))
}

const reportPath = process.env.UI_VERIFY_OUT
  || (process.env.SCRATCH ? path.join(process.env.SCRATCH, 'verify-ui-polish.json') : null)
if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2))
  console.log('\nWrote', reportPath)
}

process.exit(failures.length ? 1 : 0)
