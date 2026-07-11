/**
 * verify-ui-polish.mjs
 * Structural + content tests against SHIPPED source (CSS + components + flagship pages).
 * No re-implementation of styles — asserts the real files contain interaction feedback,
 * readable toast/modal tokens, and flagship page wiring.
 *
 * Run: node scripts/verify-ui-polish.mjs
 * Exit 0 on pass, 1 on fail.
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
  // Matches ".selector:pseudo" or ".selector:pseudo-visible" blocks exist as text in shipped CSS
  const re = new RegExp(
    `${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${pseudo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
  )
  return re.test(css)
}

// --- 1. Shared console tokens + tb-btn interaction ---
const indexCss = read('src/index.css')
assert(indexCss.includes('--yellow:'), 'index.css defines --yellow token')
assert(indexCss.includes('--metal:'), 'index.css defines --metal token')
assert(hasRule(indexCss, '.tb-btn', ':hover'), 'tb-btn has :hover')
assert(hasRule(indexCss, '.tb-btn', ':active'), 'tb-btn has :active')
assert(hasRule(indexCss, '.tb-btn', ':focus-visible'), 'tb-btn has :focus-visible')
assert(hasRule(indexCss, '.cat-chip', ':hover'), 'cat-chip has :hover')
assert(hasRule(indexCss, '.cat-chip', ':focus-visible'), 'cat-chip has :focus-visible')
assert(indexCss.includes('.gody-toast'), 'toast styles present in index.css')
assert(indexCss.includes('.gody-modal-panel'), 'modal styles present in index.css')
assert(indexCss.includes('.gody-toast--success'), 'toast success variant present')
assert(indexCss.includes('.gody-toast--error'), 'toast error variant present')
assert(indexCss.includes('color: #fecc2a') || indexCss.includes('color: #fecc2a;'), 'yellow accent color used for contrast')
assert(indexCss.includes('#C53D3D') || indexCss.includes('--alert'), 'error/alert color retained for contrast')

// --- 2. Mobile primitives interaction ---
const protoCss = read('src/styles/prototypes.css')
assert(hasRule(protoCss, '.primary-btn', ':hover'), 'primary-btn has :hover')
assert(hasRule(protoCss, '.primary-btn', ':active'), 'primary-btn has :active')
assert(hasRule(protoCss, '.primary-btn', ':focus-visible'), 'primary-btn has :focus-visible')
assert(hasRule(protoCss, '.secondary-btn', ':hover'), 'secondary-btn has :hover')
assert(hasRule(protoCss, '.vehicle-card', ':hover'), 'vehicle-card has :hover')
assert(hasRule(protoCss, '.trip-card', ':hover'), 'trip-card has :hover')
assert(hasRule(protoCss, '.payment-card', ':hover'), 'payment-card has :hover')
assert(hasRule(protoCss, '.search-pill', ':hover'), 'search-pill has :hover')
assert(hasRule(protoCss, '.quick-vehicle', ':hover'), 'quick-vehicle has :hover')
assert(hasRule(protoCss, '.map-fab', ':hover') || protoCss.includes('.map-fab:hover'), 'map-fab has :hover')
assert(protoCss.includes('.bottom-sheet'), 'bottom-sheet panel class present')

// --- 3. Modal / Toast components use shipped classes ---
const modalSrc = read('src/components/ui/Modal.tsx')
assert(modalSrc.includes('gody-modal-backdrop'), 'Modal uses gody-modal-backdrop')
assert(modalSrc.includes('gody-modal-panel'), 'Modal uses gody-modal-panel')
assert(modalSrc.includes('gody-modal-btn--primary') || modalSrc.includes('gody-modal-btn'), 'Modal primary/ghost buttons use classes')
assert(modalSrc.includes('onClose'), 'Modal still wires onClose')

const toastSrc = read('src/components/ui/Toast.tsx')
assert(toastSrc.includes('gody-toast-stack'), 'Toast uses gody-toast-stack')
assert(toastSrc.includes('gody-toast--'), 'Toast uses type variant classes')
assert(toastSrc.includes('showToast'), 'Toast exports showToast path')
assert(toastSrc.includes('dismissToast'), 'Toast supports dismiss')

// --- 4. Flagship pages: polish classes + onNavigate wiring ---
const home = read('src/pages/core/HomePage.tsx')
assert(home.includes('onNavigate'), 'HomePage keeps onNavigate')
assert(home.includes('core-search1') || home.includes("'core-search1'"), 'HomePage navigates to search')
assert(home.includes('booking-choose-car'), 'HomePage navigates to choose car')
assert(home.includes('search-pill'), 'HomePage uses search-pill')
assert(home.includes('quick-vehicle'), 'HomePage uses quick-vehicle')
assert(home.includes('map-fab') || home.includes('map-mock'), 'HomePage map/fab polish present')

const login = read('src/pages/auth/LoginPage.tsx')
assert(login.includes('onNavigate'), 'LoginPage keeps onNavigate')
assert(login.includes('core-home'), 'LoginPage navigates to home')
assert(login.includes('continueBtn') || login.includes('handlePhoneLogin'), 'LoginPage has primary continue path')
assert(login.includes('success'), 'LoginPage toast success feedback')

const chooseCar = read('src/pages/booking/ChooseCarPage.tsx')
assert(chooseCar.includes('onNavigate'), 'ChooseCarPage keeps onNavigate')
assert(chooseCar.includes('primary-btn'), 'ChooseCarPage uses primary-btn CTA')
assert(chooseCar.includes('payment-card'), 'ChooseCarPage uses payment-card')
assert(chooseCar.includes('booking-confirm-pickup1'), 'ChooseCarPage navigates to confirm pickup')
assert(chooseCar.includes('VehicleCard'), 'ChooseCarPage uses VehicleCard')

const trips = read('src/pages/trips/YourTripsUpcomingPage.tsx')
assert(trips.includes('onNavigate'), 'YourTripsUpcomingPage keeps onNavigate')
assert(trips.includes('primary-btn'), 'YourTripsUpcomingPage uses primary-btn')
assert(trips.includes('TripCard'), 'YourTripsUpcomingPage uses TripCard')
assert(trips.includes('trip-upcoming') || trips.includes('core-home'), 'YourTripsUpcomingPage nav targets wired')

// --- 5. App entry: console + routes still present ---
const app = read('src/App.tsx')
assert(app.includes('LabView') || app.includes('function LabView'), 'App LabView present')
assert(app.includes('cat-chip'), 'App category filters use cat-chip')
assert(app.includes('prototype/') || app.includes('`/prototype/'), 'App prototype routes present')
assert(app.includes('hardware-frame') || app.includes('showFrame'), 'App device frame chrome present')

const main = read('src/main.tsx')
assert(main.includes('ToastProvider'), 'main mounts ToastProvider')
assert(main.includes('HashRouter'), 'main uses HashRouter')
assert(main.includes('getElementById(\'root\')') || main.includes('getElementById("root")'), 'main mounts #root')

// --- Report ---
const summary = {
  passed: passes.length,
  failed: failures.length,
  passes,
  failures,
}

console.log('=== GODY UI polish verification ===')
console.log(`PASS: ${passes.length}`)
console.log(`FAIL: ${failures.length}`)
if (failures.length) {
  console.log('\nFailures:')
  failures.forEach((f) => console.log('  ✗', f))
}
console.log('\nPasses:')
passes.forEach((p) => console.log('  ✓', p))

const outDir = process.env.SCRATCH || path.join(root, '..', '..')
// Prefer SCRATCH when provided by harness
const reportPath = process.env.UI_VERIFY_OUT
  || (process.env.SCRATCH ? path.join(process.env.SCRATCH, 'verify-ui-polish.json') : null)

if (reportPath) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2))
  console.log('\nWrote', reportPath)
}

process.exit(failures.length ? 1 : 0)
