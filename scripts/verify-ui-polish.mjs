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

const summary = { passed: passes.length, failed: failures.length, passes, failures }
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
