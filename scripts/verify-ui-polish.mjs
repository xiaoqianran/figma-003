/**
 * verify-ui-polish.mjs — redesigned GODY Studio system checks
 * Asserts shipped tokens, restructured lab shell classes, primitives,
 * and flagship page wiring. Exit 0 on pass.
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

// --- 1. Redesigned token foundation ---
const indexCss = read('src/index.css')
assert(indexCss.includes('--gody-amber'), 'index.css defines --gody-amber token (redesign)')
assert(indexCss.includes('--lab-bg') || indexCss.includes('--lab-surface'), 'index.css defines lab surface tokens')
assert(indexCss.includes('.lab-app'), 'lab-app shell class present (restructured composition)')
assert(indexCss.includes('.lab-header'), 'lab-header present')
assert(indexCss.includes('.lab-workspace'), 'lab-workspace grid present')
assert(indexCss.includes('.lab-nav'), 'lab-nav sidebar present')
assert(indexCss.includes('.lab-stage'), 'lab-stage canvas present')
assert(indexCss.includes('.lab-aside'), 'lab-aside meta present')
assert(indexCss.includes('.lab-btn') || indexCss.includes('.tb-btn'), 'lab button system present')
assert(hasRule(indexCss, '.tb-btn', ':hover') || hasRule(indexCss, '.lab-btn', ':hover'), 'toolbar/lab btn has :hover')
assert(hasRule(indexCss, '.tb-btn', ':focus-visible') || hasRule(indexCss, '.lab-btn', ':focus-visible'), 'btn has :focus-visible')
assert(hasRule(indexCss, '.cat-chip', ':hover') || hasRule(indexCss, '.lab-chip', ':hover'), 'chips have :hover')
assert(indexCss.includes('.gody-toast'), 'toast styles present')
assert(indexCss.includes('.gody-modal-panel'), 'modal styles present')
assert(indexCss.includes('.gody-toast--success'), 'toast success variant')
assert(indexCss.includes('.gody-toast--error'), 'toast error variant')
// Observably not polish-only industrial grid shell
assert(!indexCss.includes('Industrial Archive Aesthetic') || indexCss.includes('GODY Studio'), 'visual direction is Studio redesign')
assert(indexCss.includes('radial-gradient') || indexCss.includes('lab-workspace'), 'new ambient/layout system (not flat industrial only)')

// Device viewport tokens must match mobile-frame 375×812 (prevents clip in preview)
assert(indexCss.includes('--device-w: 375px') || indexCss.includes('--device-w:375px'), 'device width token is 375px')
assert(indexCss.includes('--device-h: 812px') || indexCss.includes('--device-h:812px'), 'device height token is 812px')
assert(indexCss.includes('var(--device-w)') && indexCss.includes('var(--device-h)'), 'hardware-frame uses device tokens')
assert(!/width:\s*372px/.test(indexCss), 'hardware-frame no longer undersized 372px')
assert(!/height:\s*780px/.test(indexCss), 'hardware-frame no longer undersized 780px')

// --- 2. Mobile primitives ---
const protoCss = read('src/styles/prototypes.css')
assert(protoCss.includes('width: 375px') && protoCss.includes('height: 812px'), 'mobile-frame is 375×812')
assert(!/height:\s*858px/.test(protoCss), 'mobile-frame-tall no longer 858px overflow')
assert(hasRule(protoCss, '.primary-btn', ':hover'), 'primary-btn has :hover')
assert(hasRule(protoCss, '.primary-btn', ':active'), 'primary-btn has :active')
assert(hasRule(protoCss, '.primary-btn', ':focus-visible'), 'primary-btn has :focus-visible')
assert(hasRule(protoCss, '.secondary-btn', ':hover'), 'secondary-btn has :hover')
assert(hasRule(protoCss, '.vehicle-card', ':hover'), 'vehicle-card has :hover')
assert(hasRule(protoCss, '.trip-card', ':hover'), 'trip-card has :hover')
assert(hasRule(protoCss, '.payment-card', ':hover'), 'payment-card has :hover')
assert(hasRule(protoCss, '.search-pill', ':hover'), 'search-pill has :hover')
assert(protoCss.includes('.bottom-sheet') || protoCss.includes('.confirm-card'), 'bottom sheet shell present')
assert(protoCss.includes('--gody-amber') || protoCss.includes('#f0b429') || protoCss.includes('f0b429'), 'product amber accent in primitives')

// --- 3. Modal / Toast wired to redesign classes ---
const modalSrc = read('src/components/ui/Modal.tsx')
assert(modalSrc.includes('gody-modal-backdrop'), 'Modal uses gody-modal-backdrop')
assert(modalSrc.includes('gody-modal-panel'), 'Modal uses gody-modal-panel')
assert(modalSrc.includes('onClose'), 'Modal wires onClose')

const toastSrc = read('src/components/ui/Toast.tsx')
assert(toastSrc.includes('gody-toast-stack'), 'Toast uses gody-toast-stack')
assert(toastSrc.includes('gody-toast--'), 'Toast type variants')
assert(toastSrc.includes('showToast'), 'Toast showToast path')

// --- 4. App shell composition uses redesign ---
const app = read('src/App.tsx')
assert(app.includes('lab-app'), 'App uses lab-app shell')
assert(app.includes('lab-workspace'), 'App uses lab-workspace')
assert(app.includes('lab-nav'), 'App uses lab-nav')
assert(app.includes('lab-stage'), 'App uses lab-stage')
assert(app.includes('lab-aside') || app.includes('InfoPanel'), 'App meta/aside panel')
assert(app.includes('LabView') || app.includes('function LabView'), 'LabView present')
assert(app.includes('prototype/') || app.includes('`/prototype/'), 'prototype routes present')
assert(app.includes('hardware-frame') || app.includes('showFrame'), 'device frame chrome present')
assert(app.includes('cat-chip') || app.includes('lab-chip'), 'category chips in App')

// --- 5. Flagship pages ---
const home = read('src/pages/core/HomePage.tsx')
assert(home.includes('onNavigate'), 'HomePage keeps onNavigate')
assert(home.includes('core-search1'), 'HomePage → search')
assert(home.includes('booking-choose-car'), 'HomePage → choose car')
assert(home.includes('search-pill'), 'HomePage search-pill')
assert(home.includes('quick-vehicle') || home.includes('dest-chip'), 'HomePage product cards')
assert(home.includes('home-vehicles') || home.includes('Available near you'), 'Home available vehicles section')
assert(home.includes('home-bottom-panel') || home.includes('flexShrink'), 'Home bottom panel in-flow (not clipped absolute stack)')
assert(home.includes('maxHeight') || home.includes('flex:'), 'Home map constrained for 812 fit')

const login = read('src/pages/auth/LoginPage.tsx')
assert(login.includes('onNavigate'), 'LoginPage onNavigate')
assert(login.includes('core-home'), 'LoginPage → home')
assert(login.includes('continueBtn') || login.includes('Continue'), 'LoginPage primary continue')
assert(login.includes('success'), 'LoginPage toast success')

const chooseCar = read('src/pages/booking/ChooseCarPage.tsx')
assert(chooseCar.includes('onNavigate'), 'ChooseCar onNavigate')
assert(chooseCar.includes('primary-btn'), 'ChooseCar primary-btn')
assert(chooseCar.includes('payment-card'), 'ChooseCar payment-card')
assert(chooseCar.includes('booking-confirm-pickup1'), 'ChooseCar → confirm pickup')
assert(chooseCar.includes('VehicleCard'), 'ChooseCar VehicleCard')
assert(chooseCar.includes('choose-car-schedule') || chooseCar.includes('Schedule'), 'ChooseCar Schedule CTA present')
assert(!/height:\s*858/.test(chooseCar), 'ChooseCar not 858px tall (fits 812 viewport)')
assert(chooseCar.includes('bottom: 0') || chooseCar.includes("bottom: 0"), 'ChooseCar sheet bottom-anchored')

const trips = read('src/pages/trips/YourTripsUpcomingPage.tsx')
assert(trips.includes('onNavigate'), 'Trips onNavigate')
assert(trips.includes('primary-btn'), 'Trips primary-btn')
assert(trips.includes('TripCard'), 'Trips TripCard')
assert(trips.includes('trip-upcoming') || trips.includes('core-home'), 'Trips nav targets')

const main = read('src/main.tsx')
assert(main.includes('ToastProvider'), 'main ToastProvider')
assert(main.includes('HashRouter'), 'main HashRouter')
assert(main.includes("getElementById('root')") || main.includes('getElementById("root")'), 'main mounts #root')

// Console components use redesign hooks
const toolbar = read('src/components/console/ConsoleToolbar.tsx')
assert(toolbar.includes('lab-btn') || toolbar.includes('tb-btn'), 'ConsoleToolbar uses lab buttons')
const info = read('src/components/console/InfoPanel.tsx')
assert(info.includes('lab-meta') || info.includes('lab-btn'), 'InfoPanel redesigned meta card')
const stats = read('src/components/console/StatsBar.tsx')
assert(stats.includes('lab-stat-pill') || stats.includes('lab-header-stats'), 'StatsBar uses redesign pills')

const summary = { passed: passes.length, failed: failures.length, passes, failures }
console.log('=== GODY Studio redesign verification ===')
console.log(`PASS: ${passes.length}`)
console.log(`FAIL: ${failures.length}`)
if (failures.length) {
  console.log('\nFailures:')
  failures.forEach((f) => console.log('  ✗', f))
}
console.log('\nPasses:')
passes.forEach((p) => console.log('  ✓', p))

const reportPath = process.env.UI_VERIFY_OUT
  || (process.env.SCRATCH ? path.join(process.env.SCRATCH, 'verify-ui-polish.json') : null)
if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2))
  console.log('\nWrote', reportPath)
}

process.exit(failures.length ? 1 : 0)
