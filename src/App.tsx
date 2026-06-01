import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import './index.css'
import './styles/prototypes.css'

// Registry + helpers
import pageRegistry, { findPageById, type PageDefinition, migratedCount } from './pageRegistry'

// Demo state + notifications
import { useDemoState, type DemoTrip } from './context/DemoStateContext'
import { useToast, Modal } from './components/ui'

// Console devtools & panels
import { DemoStateInspector, StatsBar, ConsoleToolbar, InfoPanel, PageListItem, PreviewErrorBoundary } from './components/console'

// Internal types for Flow Simulator (strict typing, no `any`, reuses DemoTrip)
interface SimStep {
  id: string
  title: string
  desc: string
  inject?: Partial<DemoTrip>
}

interface SimController {
  aborted: boolean
  paused: boolean
  speed: number
  skipRequested: boolean
  steps: readonly SimStep[]
  idx: number
  resumeResolver: (() => void) | null
  runId: number
}

interface FlowPreset {
  readonly name: string
  readonly desc: string
  readonly steps: readonly SimStep[]
}

// Static lists (module scope for stable refs, no per-render recreation, helps keyboard effect + exhaustive-deps)
const CATEGORY_LIST = ['All', 'Auth', 'Core', 'Booking', 'Payment', 'Trips', 'Account', 'Map', 'Other'] as const

// FLOW PRESETS defined at module scope (prevents stale closures in runFlowPreset useCallback + makes data stable for aggressive re-triggers)
const FLOW_PRESETS_DATA: Record<'standard' | 'trip-mgmt' | 'account-payment' | 'full-e2e', FlowPreset> = {
  standard: {
    name: 'Standard Booking Flow',
    desc: 'Classic 5-step ride request — flagship demo journey',
    steps: [
      { id: 'core-home', title: 'Home', desc: 'User launches app — live map shows 14 nearby EVs ready' },
      { id: 'core-search1', title: 'Search', desc: 'Enters destination “Lujiazui Tower”. Smart suggestions + price estimates' },
      { id: 'booking-choose-car', title: 'Choose Vehicle', desc: 'Compares 3 options: XPeng P7 ¥78, NIO ¥92, Tesla ¥105. Selects premium' },
      { id: 'booking-confirm-pickup1', title: 'Confirm Pickup', desc: 'Pins exact spot on map. Driver match in 8s. ETA locked' },
      { id: 'booking-requesting', title: 'Requesting', desc: 'Broadcasting request. Real-time driver pings. Final confirmation step' },
    ]
  },
  'trip-mgmt': {
    name: 'Trip Management Flow',
    desc: 'Realistic upcoming trips → detail → status transitions',
    steps: [
      { id: 'trips-hub', title: 'Trips Hub', desc: 'Opens full trip management dashboard with counts & filters' },
      { id: 'trips-upcoming', title: 'Upcoming Trips', desc: 'Reviews 2 scheduled rides. Taps active card for details' },
      { id: 'trip-upcoming', title: 'Trip Detail', desc: 'Inspects route, driver info, live tracking toggle. Powerful demo data', inject: { from: 'Hongqiao Airport T2', to: 'Puxi Riverside Promenade', driver: 'Wang Lei', vehicle: 'NIO ET7 • Obsidian', eta: '11 min', price: 118, status: 'upcoming' } },
      { id: 'trips-detail-completed', title: 'Complete Ride', desc: 'Simulates ride finish. Auto-updates status + receipt available', inject: { from: 'Hongqiao Airport T2', to: 'Puxi Riverside Promenade', driver: 'Wang Lei', vehicle: 'NIO ET7 • Obsidian', eta: 'Arrived', price: 118, status: 'completed' } },
      { id: 'trips-past', title: 'History', desc: 'Archives completed trip. Filters & export options shown for realism' },
    ]
  },
  'account-payment': {
    name: 'Account + Payment Flow',
    desc: 'Profile management → payment method selection & checkout',
    steps: [
      { id: 'account-profile', title: 'My Profile', desc: 'Views loyalty tier, ride stats, quick edit access' },
      { id: 'account-edit1', title: 'Edit Account', desc: 'Updates phone & notification prefs. Form validation demo' },
      { id: 'payment-select', title: 'Payment Methods', desc: 'Manages Visa ••••4242, Alipay, WeChat. Sets default' },
      { id: 'payment-confirm', title: 'Checkout', desc: 'Confirms ¥118 ride charge with selected method + receipt' },
    ]
  },
  'full-e2e': {
    name: 'Full End-to-End',
    desc: 'Comprehensive 9-step realistic user lifecycle (booking + pay + manage + account)',
    steps: [
      { id: 'core-home', title: 'Home', desc: 'Start of day — map & quick book CTA' },
      { id: 'core-search1', title: 'Search', desc: 'Plans commute to financial district' },
      { id: 'booking-choose-car', title: 'Choose Vehicle', desc: 'Selects efficient EV for 45km journey' },
      { id: 'booking-confirm-pickup1', title: 'Pickup', desc: 'Confirms location & driver assignment' },
      { id: 'payment-confirm', title: 'Payment', desc: 'Pre-authorizes charge on saved card' },
      { id: 'booking-requesting', title: 'Request Sent', desc: 'Awaits match — live status overlay' },
      { id: 'trips-upcoming', title: 'My Trips', desc: 'Verifies booking appears in upcoming list' },
      { id: 'trip-upcoming', title: 'Live Detail', desc: 'Monitors driver arrival countdown', inject: { from: 'Jing\'an Temple', to: 'Century Avenue Tower', driver: 'Chen Fang', vehicle: 'Li Auto L9 • Pearl', eta: '3 min', price: 64, status: 'in-progress' } },
      { id: 'account-profile', title: 'Account Check', desc: 'Post-ride review of updated stats & loyalty points' },
    ]
  }
}

// Graceful not-found rendered *inside* the device frame for bad deep links (both lab + standalone)
function NotFoundInDevice({ pageId, onNavigateHome, onTryRandom }: { pageId: string; onNavigateHome: () => void; onTryRandom?: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-[#0A0908] console-font px-5 text-center" style={{ background: '#F5F3ED' }}>
      <div style={{ fontSize: 28, marginBottom: 4 }}>🔎</div>
      <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.2px' }}>Prototype not found</div>
      <div style={{ fontSize: 11, color: '#6E6A61', marginTop: 2, marginBottom: 10 }}>
        “{pageId}” does not exist in the registry
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {onTryRandom && (
          <button onClick={onTryRandom} className="tb-btn" style={{ fontSize: 10, padding: '3px 9px' }}>
            🎲 Try Random
          </button>
        )}
        <button onClick={onNavigateHome} className="tb-btn" style={{ fontSize: 10, padding: '3px 9px' }}>
          ← Console Home
        </button>
      </div>
      <div style={{ marginTop: 10, fontSize: 9, color: '#95928A' }}>Deep link preserved • Pick another from sidebar</div>
    </div>
  )
}

// --- Lab Console View (handles / and /prototype/:pageId) ---
function LabView() {
  const { pageId } = useParams<{ pageId?: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  // Full demo state access for premium features (reset + mutations for quick actions / simulator)
  const { resetDemoState, setActiveTrip, addRecentAction, bookTrip, clearBookedTrips } = useDemoState()

  // Core UI state
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [zoom, setZoom] = useState(1)
  const [isRotated, setIsRotated] = useState(false)
  const [showFrame, setShowFrame] = useState(true)

  // Favorites + Recently Viewed + Flow history (localStorage persisted)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentViewed, setRecentViewed] = useState<string[]>([])
  const [flowHistory, setFlowHistory] = useState<string[]>([])

  // Enhanced Flow Simulator states (standout stakeholder demo tool)
  const [showFlowPresets, setShowFlowPresets] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simPreset, setSimPreset] = useState('')
  const [simStep, setSimStep] = useState(0)
  const [simTotal, setSimTotal] = useState(0)
  const [simSpeed, setSimSpeed] = useState(1)
  const [simPaused, setSimPaused] = useState(false)
  const [showPostSimModal, setShowPostSimModal] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const simCtrl = useRef<SimController>({
    aborted: false,
    paused: false,
    speed: 1,
    skipRequested: false,
    steps: [],
    idx: 0,
    resumeResolver: null,
    runId: 0,
  })

  // Early-defined abort helper (no TDZ for early handlers + rapid switch guards). Used by stop + guards.
  const abortCurrentSimulation = () => {
    const c = simCtrl.current
    c.aborted = true
    c.skipRequested = true
    if (c.paused && c.resumeResolver) {
      c.resumeResolver()
      c.resumeResolver = null
    }
    setIsSimulating(false)
    setSimPaused(false)
    setSimStep(0)
    setSimTotal(0)
  }

  // Derive selected from router (deep link + refresh safe)
  const selectedPage: PageDefinition | null = pageId
    ? (findPageById(pageId) ?? null)
    : null

  // Categories (static) — use module const for stability
  const categoryList = CATEGORY_LIST

  // Persist + hydrate console prefs (Favorites, Recent, Flow, frame, zoom)
  /* eslint-disable react-hooks/set-state-in-effect -- standard one-time localStorage hydrate (acceptable; sets only run once on mount) */
  useEffect(() => {
    try {
      const f = localStorage.getItem('gody-console-favorites')
      if (f) setFavorites(JSON.parse(f))
      const r = localStorage.getItem('gody-console-recent')
      if (r) setRecentViewed(JSON.parse(r))
      const fl = localStorage.getItem('gody-console-flow')
      if (fl) setFlowHistory(JSON.parse(fl))
      const fr = localStorage.getItem('gody-console-frame')
      if (fr != null) setShowFrame(fr === 'true')
      const z = localStorage.getItem('gody-console-zoom')
      if (z) setZoom(parseFloat(z))
    } catch { /* ignore */ }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Auto-persist on mutation
  useEffect(() => { localStorage.setItem('gody-console-favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { localStorage.setItem('gody-console-recent', JSON.stringify(recentViewed)) }, [recentViewed])
  useEffect(() => { localStorage.setItem('gody-console-flow', JSON.stringify(flowHistory)) }, [flowHistory])
  useEffect(() => { localStorage.setItem('gody-console-frame', String(showFrame)) }, [showFrame])
  useEffect(() => { localStorage.setItem('gody-console-zoom', String(zoom)) }, [zoom])

  // Track flow + recent when selection changes
  const pushRecentAndFlow = useCallback((id: string) => {
    setRecentViewed(prev => [id, ...prev.filter(x => x !== id)].slice(0, 8))
    setFlowHistory(prev => [id, ...prev.filter(x => x !== id)].slice(0, 10))
  }, [])

  /* eslint-disable react-hooks/set-state-in-effect -- derived side-effect tracking for recent/flow history (intentional on selection change) */
  useEffect(() => {
    if (selectedPage) pushRecentAndFlow(selectedPage.id)
  }, [selectedPage, selectedPage?.id, pushRecentAndFlow])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Action helpers (defined early to avoid TDZ in keyboard effect & other effects)
  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id)
      const next = isFav ? prev.filter(x => x !== id) : [...prev, id]
      showToast({ type: 'success', title: isFav ? 'Removed from favorites' : 'Added to favorites', message: pageRegistry.find(p => p.id === id)?.title })
      return next
    })
  }, [showToast])

  const copyLinkFor = useCallback((page: PageDefinition) => {
    const url = `${window.location.origin}${window.location.pathname}#/prototype/${page.id}`
    navigator.clipboard.writeText(url).then(() => {
      showToast({ type: 'success', title: 'Link copied', message: `${page.title} deep link` })
    }).catch(() => {
      showToast({ type: 'warning', title: 'Clipboard unavailable', message: `Copy manually: ${url}`, duration: 7000 })
      console.log('[Clipboard fallback] Copy link:', url)
    })
  }, [showToast])

  // NEW: Standalone link copier (for the dedicated enhancement + toolbar + standalone chrome)
  const copyStandaloneLinkFor = useCallback((page: PageDefinition) => {
    const url = `${window.location.origin}${window.location.pathname}#/standalone/${page.id}`
    navigator.clipboard.writeText(url).then(() => {
      showToast({ type: 'success', title: 'Standalone link copied', message: `${page.title} fullscreen preview` })
    }).catch(() => {
      showToast({ type: 'warning', title: 'Clipboard unavailable', message: `Copy manually: ${url}`, duration: 7000 })
      console.log('[Clipboard fallback] Copy standalone link:', url)
    })
  }, [showToast])

  const handleCopyCurrent = useCallback(() => { if (selectedPage) copyLinkFor(selectedPage) }, [selectedPage, copyLinkFor])
  const handleCopyStandalone = useCallback(() => { if (selectedPage) copyStandaloneLinkFor(selectedPage) }, [selectedPage, copyStandaloneLinkFor])

  const handleSelectPage = useCallback((page: PageDefinition) => {
    // Guard for rapid switching journey: abort active sim on manual sidebar/console selection to prevent nav fighting / confusing state
    if (isSimulating) {
      abortCurrentSimulation()
      showToast({ type: 'info', title: 'Simulation aborted', message: 'Manual navigation takes over', duration: 900 })
    }
    navigate(`/prototype/${page.id}`)
  }, [navigate, isSimulating, showToast])

  // Robust onNavigate handler from inside prototypes: syncs URL + shows toast on bad ids (prevents broken deep links)
  const handleNavigate = useCallback((targetId: string) => {
    const target = findPageById(targetId)
    if (target) {
      navigate(`/prototype/${targetId}`)
    } else {
      showToast({ type: 'error', title: 'Navigation failed', message: `No prototype found for “${targetId}”` })
    }
  }, [navigate, showToast])

  const handleRandom = useCallback(() => {
    // Guard for rapid switching / sim journeys: abort active sim on manual random to prevent conflicting navigation
    if (isSimulating) {
      abortCurrentSimulation()
      showToast({ type: 'info', title: 'Simulation aborted', message: 'Random selection takes over', duration: 900 })
    }
    const rand = pageRegistry[Math.floor(Math.random() * pageRegistry.length)]
    navigate(`/prototype/${rand.id}`)
    showToast({ type: 'info', title: 'Random prototype', message: rand.title })
  }, [navigate, showToast, isSimulating])

  const handleResetAll = useCallback(() => {
    ['gody-console-favorites','gody-console-recent','gody-console-flow','gody-console-frame','gody-console-zoom']
      .forEach(k => localStorage.removeItem(k))
    setFavorites([]); setRecentViewed([]); setFlowHistory([])
    setShowFrame(true); setZoom(1); setSearchTerm(''); setActiveCategory('All')
    // Also clear any in-flight simulator UI state + abort controller
    setIsSimulating(false)
    setShowPostSimModal(false)
    setSimStep(0)
    setSimTotal(0)
    setSimPaused(false)
    const c = simCtrl.current
    c.aborted = true
    c.skipRequested = true
    if (c.paused && c.resumeResolver) { c.resumeResolver(); c.resumeResolver = null }
    resetDemoState()
    navigate('/')
    showToast({ type: 'success', title: 'All demo state reset', message: `Console + global demo cleared. ${pageRegistry.length} pages ready.` })
  }, [resetDemoState, navigate, showToast])

  const handleZoomChange = useCallback((z: number) => setZoom(z), [])
  const handleToggleFrame = useCallback(() => setShowFrame(s => !s), [])
  const handleRotate = useCallback(() => setIsRotated(r => !r), [])

  const handleStartFlow = useCallback((page: PageDefinition) => {
    const flowMap: Record<string, string> = {
      'auth-login': 'core-home', 'core-home': 'booking-choose-car', 'booking-choose-car': 'booking-choose-trip1',
      'booking-choose-trip1': 'booking-confirm-pickup1', 'payment-select': 'payment-confirm',
      'trips-hub': 'trips-upcoming', 'account-profile': 'account-edit1',
    }
    const start = findPageById(flowMap[page.id] || page.id) || page
    navigate(`/prototype/${start.id}`)
    showToast({ type: 'info', title: 'User flow started', message: `From ${start.title}` })
  }, [navigate, showToast])

  // Premium lab features: Flow Simulator + Quick Actions helpers (integrate with DemoState + Toast)
  // The Flow Simulator is now a powerful multi-preset controllable demo tool for stakeholders.
  const loadDemoTrip = useCallback(() => {
    bookTrip({
      status: 'in-progress',
      from: 'Pudong International',
      to: 'Lujiazui Financial Center',
      driver: 'Li Ming',
      vehicle: 'XPeng P7 • Silver',
      eta: '7 min',
      price: 92,
    })
    addRecentAction('Loaded realistic demo trip via Quick Actions (multi-trip)')
    showToast({ type: 'success', title: 'Demo trip booked', message: 'Persisted to bookedTrips • visible in inspector + trips pages' })
  }, [bookTrip, addRecentAction, showToast])

  const jumpToPopular = useCallback(() => {
    handleNavigate('booking-choose-car')
    showToast({ type: 'info', title: 'Jumped to popular', message: 'Vehicle chooser — core high-traffic prototype' })
  }, [handleNavigate, showToast])

  // NEW: Seed multiple realistic trips for rich demo of the new bookedTrips system
  const seedMultiTrips = useCallback(() => {
    if (typeof clearBookedTrips === 'function') clearBookedTrips()
    bookTrip({ status: 'completed', from: 'Hongqiao Airport T2', to: 'Puxi Riverside', driver: 'Wang Lei', vehicle: 'NIO ET7', price: 118, eta: 'Arrived' })
    bookTrip({ status: 'upcoming', from: 'Jing\'an Temple', to: 'Century Avenue', driver: 'Chen Fang', vehicle: 'Li Auto L9', price: 64, eta: '14 min' })
    const t3 = bookTrip({ status: 'in-progress', from: 'The Bund', to: 'Zhangjiang Hi-Tech', driver: 'Zhao Min', vehicle: 'BYD Seal', price: 71, eta: '9 min' })
    addRecentAction(`Seeded 3 sample trips (latest active: ${t3.to})`)
    showToast({ type: 'success', title: '3 sample trips seeded', message: 'Upcoming + In-progress + Completed in bookedTrips' })
    // Jump to trips hub to immediately see the result
    setTimeout(() => handleNavigate('trips-hub'), 650)
  }, [bookTrip, clearBookedTrips, addRecentAction, showToast, handleNavigate])

  // Use the stable module-scope presets (no per-render object, eliminates stale closure risk in simulator for rapid preset triggers + mid-run controls)
  const FLOW_PRESETS = FLOW_PRESETS_DATA

  // Controllable simulation engine with pause, skip, speed multiplier support
  // Always reads live simCtrl.current so pause/skip/abort from toolbar/keyboard/quick actions
  // take effect immediately even mid-wait (robust against timing/closure).
  // ENHANCED: speed multiplier now affects in-progress waits live (user can change 0.5x-2x mid-run and see immediate effect)
  const waitWithControls = (baseMs: number) => new Promise<void>((resolve) => {
    let effectiveElapsed = 0
    const tick = 50 // finer grain for responsive live speed changes
    const iv = setInterval(() => {
      const live = simCtrl.current
      if (live.aborted || live.skipRequested) {
        clearInterval(iv)
        live.skipRequested = false
        resolve()
        return
      }
      if (!live.paused) {
        const spd = live.speed || 1
        effectiveElapsed += tick * spd // advance "sim time" proportionally to current speed
        if (effectiveElapsed >= baseMs) {
          clearInterval(iv)
          resolve()
        }
      }
    }, tick)
  })

  const runFlowPreset = useCallback(async (presetKey: keyof typeof FLOW_PRESETS) => {
    const preset = FLOW_PRESETS[presetKey]
    if (!preset) return

    // === RACE SAFETY: Abort any in-flight previous simulation ===
    // Prevents overlapping loops, stale setState after end, double modals, and closure bugs
    // when user rapidly triggers presets / simulate / quick-actions / command palette.
    const prev = simCtrl.current
    prev.aborted = true
    prev.skipRequested = true
    if (prev.paused && prev.resumeResolver) {
      prev.resumeResolver()
      prev.resumeResolver = null
    }

    const myRunId = Date.now() + Math.random()

    // Fresh controller for this run only
    simCtrl.current = {
      aborted: false,
      paused: false,
      speed: 1,
      skipRequested: false,
      steps: preset.steps,
      idx: 0,
      resumeResolver: null,
      runId: myRunId,
    }

    setShowPostSimModal(false) // prevent lingering post-sim modal if re-triggered
    setSimPreset(preset.name)
    setSimTotal(preset.steps.length)
    setSimStep(0)
    setIsSimulating(true)
    setSimPaused(false)
    setSimSpeed(1)
    setShowFlowPresets(false)

    showToast({
      type: 'warning',
      title: `▶ ${preset.name.toUpperCase()}`,
      message: `${preset.desc} — ${preset.steps.length} steps • Controllable demo`,
      duration: 1650,
    })
    addRecentAction(`Flow Simulator started: ${preset.name}`)

    for (let i = 0; i < preset.steps.length; i++) {
      const c = simCtrl.current
      if (c.aborted || c.runId !== myRunId) break

      c.idx = i
      setSimStep(i + 1)

      // Pause gate (always consult live controller for pause/resume/skip/abort from UI)
      while (true) {
        const live = simCtrl.current
        if (!live.paused || live.aborted || live.runId !== myRunId) break
        await new Promise<void>((res) => { live.resumeResolver = () => res() })
        live.resumeResolver = null
      }
      const c2 = simCtrl.current
      if (c2.aborted || c2.runId !== myRunId) break

      const step = preset.steps[i]
      handleNavigate(step.id)

      // Rich contextual narration
      const liveSpeed = simCtrl.current.speed || 1
      showToast({
        type: 'info',
        title: `Step ${i + 1}/${preset.steps.length} — ${step.title}`,
        message: step.desc,
        duration: Math.max(980, Math.round(1480 / liveSpeed)),
      })

      // Powerful state injection (variety + realism)
      if (step.inject) {
        const inj = step.inject
        // Use bookTrip (new) so simulator also populates the persistent bookedTrips list
        bookTrip({
          id: `sim-${presetKey}-${String(i)}`,
          status: (inj.status || 'in-progress') as 'upcoming' | 'in-progress' | 'completed',
          from: inj.from || 'Demo Pickup',
          to: inj.to || 'Demo Dropoff',
          driver: inj.driver || 'Demo Driver',
          vehicle: inj.vehicle || 'GODY Premium EV',
          eta: inj.eta || '6 min',
          price: inj.price || 85,
        })
        addRecentAction(`Simulator: ${step.title} → demo trip injected (booked)`)
      }
      // status-only transitions handled via inject in current presets for simplicity & reliability
      // (DemoState setter accepts value, not updater fn)

      // Variable realistic pacing scaled by speed + skip support (speed changes mid-wait now respected live)
      const base = 760 + ((i % 4) * 95)
      await waitWithControls(base)
    }

    // Cleanup + end state — guarded against stale runs from rapid re-triggers
    const c = simCtrl.current
    if (c.runId !== myRunId) {
      // This was an aborted stale loop; do not flip global sim UI state or show modals
      return
    }
    const wasAborted = c.aborted
    setIsSimulating(false)
    setSimStep(0)
    setSimTotal(0)
    setSimPaused(false)

    if (!wasAborted) {
      // Guarantee final realistic trip for the preset if not already set in last step
      if (!preset.steps.some((s) => s.inject)) {
        const variety = [
          { from: 'Shanghai Railway Station', to: 'Pudong Airport', driver: 'Liu Qiang', vehicle: 'XPeng G9 • Matte', price: 134, eta: '9 min' },
          { from: 'The Bund', to: 'Zhangjiang Hi-Tech', driver: 'Zhao Min', vehicle: 'BYD Seal • Blue', price: 71, eta: '14 min' },
        ]
        const pick = variety[Math.floor(Math.random() * variety.length)]
        bookTrip({
          id: `flow-${presetKey}-final`,
          status: 'in-progress',
          ...pick,
        })
      }
      addRecentAction(`Completed Flow Simulator: ${preset.name}`)
      setShowPostSimModal(true)
    } else {
      addRecentAction('Flow Simulator interrupted by user')
    }
  }, [handleNavigate, showToast, setActiveTrip, addRecentAction, bookTrip, FLOW_PRESETS])

  // Legacy quick entry (used by button + command palette + Quick Actions)
  const simulateBookingFlow = useCallback(() => {
    runFlowPreset('standard')
  }, [runFlowPreset])

  // Simulator controls (called from the live control bar rendered below toolbar)
  const toggleSimPause = useCallback(() => {
    const c = simCtrl.current
    c.paused = !c.paused
    setSimPaused(c.paused)
    if (!c.paused && c.resumeResolver) {
      c.resumeResolver()
      c.resumeResolver = null
    }
    showToast({
      type: 'info',
      title: c.paused ? '⏸ Simulation Paused' : '▶ Simulation Resumed',
      message: simPreset || 'Flow',
      duration: 1100
    })
  }, [showToast, simPreset])

  const skipSimStep = useCallback(() => {
    const c = simCtrl.current
    c.skipRequested = true
    if (c.paused) {
      c.paused = false
      setSimPaused(false)
      if (c.resumeResolver) { c.resumeResolver(); c.resumeResolver = null }
    }
    showToast({ type: 'info', title: '⏭ Step skipped', duration: 700 })
  }, [showToast])

  const setSimSpeedCtl = useCallback((newSpeed: number) => {
    const c = simCtrl.current
    c.speed = newSpeed
    setSimSpeed(newSpeed)
    showToast({ type: 'info', title: `Speed set to ${newSpeed}×`, message: 'Delays adjusted live', duration: 850 })
  }, [showToast])

  const stopSimulation = useCallback(() => {
    abortCurrentSimulation()
    showToast({ type: 'warning', title: '■ Simulation stopped', message: 'Demo flow interrupted — state preserved' })
  }, [showToast])

  // Keyboard shortcuts: / focus, Esc clear, numbers for cats, R random, F fav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const targetEl = e.target as HTMLElement
      const inInput = targetEl.tagName === 'INPUT' || targetEl.tagName === 'TEXTAREA'

      if (e.key === '/' && !inInput) { e.preventDefault(); searchInputRef.current?.focus(); return }
      if (e.key === 'Escape') { if (searchTerm) setSearchTerm(''); searchInputRef.current?.blur(); return }

      if (!inInput) {
        const k = e.key.toLowerCase()
        if (k === 'r') { e.preventDefault(); handleRandom(); return }
        if (/^[1-9]$/.test(e.key)) {
          const idx = parseInt(e.key, 10) - 1
          if (categoryList[idx]) setActiveCategory(categoryList[idx])
          return
        }
        if (k === 'f' && selectedPage) { toggleFavorite(selectedPage.id); return }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [searchTerm, selectedPage, categoryList, handleRandom, toggleFavorite])

  // CRITICAL: Abort any in-flight Flow Simulator on unmount (e.g. rapid switch to Standalone view via button or direct link)
  // Prevents React "setState on unmounted" warnings, dangling intervals, and stale async updates during aggressive navigation.
  useEffect(() => {
    return () => {
      const c = simCtrl.current
      c.aborted = true
      c.skipRequested = true
      if (c.paused && c.resumeResolver) {
        c.resumeResolver()
        c.resumeResolver = null
      }
      // UI flags will be irrelevant as component unmounts; no setState here
    }
  }, [])

  // Filtered browse list
  const filteredPages = useMemo(() => {
    return pageRegistry.filter(p => {
      const matchesSearch = !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, activeCategory])

  // Derived
  const migrated = migratedCount()
  const total = pageRegistry.length

  const favPages = useMemo(() => pageRegistry.filter(p => favorites.includes(p.id)), [favorites])
  const recentPages = useMemo(() => recentViewed.map(id => pageRegistry.find(p => p.id === id)).filter(Boolean) as PageDefinition[], [recentViewed])
  const categories = useMemo(() => ['All', ...Array.from(new Set(pageRegistry.map(p => p.category)))], [])

  // Category counts for clearer UI (premium search feel)
  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = { All: total }
    pageRegistry.forEach(p => {
      c[p.category] = (c[p.category] || 0) + 1
    })
    return c
  }, [total])

  return (
    <div className="lab-grid min-h-screen text-[#EDEBE5]">
      <div className="max-w-[1340px] mx-auto px-8 pt-9">
        {/* Premium Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-x-3">
              <div className="w-7 h-7 bg-[#fecc2a] flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-[#0A0908]" />
              </div>
              <span className="display-font text-5xl font-bold tracking-[-1.5px]">GODY</span>
            </div>
            <div className="ml-11 -mt-1 flex items-center gap-x-2">
              <span className="section-label tracking-[2.5px]">PROTOTYPE CONSOLE</span>
              <span className="text-[#B8B5B0] text-xs console-font">REACT EDITION • PREMIUM</span>
            </div>
          </div>

          <div className="text-sm text-[#B8B5B0] console-font text-right">
            {total} PROTOTYPES • {migrated}/{total} REAL COMPONENTS
          </div>
        </div>

        {/* Stats bar + Top toolbar */}
        <StatsBar
          total={total}
          migrated={migrated}
          favoritesCount={favorites.length}
          recentCount={recentViewed.length}
          flowLength={flowHistory.length}
        />
        <ConsoleToolbar
          onRandom={handleRandom}
          onReset={handleResetAll}
          showFrame={showFrame}
          onToggleFrame={handleToggleFrame}
          zoom={zoom}
          onZoomChange={handleZoomChange}
          isRotated={isRotated}
          onRotate={handleRotate}
          onCopyCurrentLink={selectedPage ? handleCopyCurrent : undefined}
          onCopyStandaloneLink={selectedPage ? handleCopyStandalone : undefined}
          selectedTitle={selectedPage?.title}
          // New premium lab actions
          onSimulateFlow={simulateBookingFlow}
          onLoadDemoTrip={loadDemoTrip}
          onJumpPopular={jumpToPopular}
          onOpenFlowPresets={() => setShowFlowPresets(true)}
          onSeedMultiTrips={seedMultiTrips}
        />

        {/* LIVE SIMULATOR CONTROLS — only visible while a flow preset is running. Full pause/resume/skip/speed support */}
        {isSimulating && (
          <div
            className="metal"
            style={{
              margin: '0 0 12px',
              padding: '9px 14px',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 12,
              border: '1px solid #3A3935',
              background: 'linear-gradient(180deg, #1A1916 0%, #131210 100%)'
            }}
          >
            <div style={{ color: '#fecc2a', fontWeight: 700, letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 6 }}>
              ▶ LIVE DEMO
            </div>
            <div style={{ opacity: 0.85, fontFamily: 'IBM Plex Mono, monospace', fontSize: 11 }}>
              {simPreset} • Step <span style={{ color: '#fecc2a', fontWeight: 600 }}>{simStep}</span>/{simTotal}
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <button
                onClick={toggleSimPause}
                className="tb-btn"
                style={{ padding: '3px 10px', fontSize: 11, fontWeight: 600 }}
              >
                {simPaused ? '▶ RESUME' : '⏸ PAUSE'}
              </button>
              <button
                onClick={skipSimStep}
                className="tb-btn"
                style={{ padding: '3px 10px', fontSize: 11 }}
              >
                ⏭ SKIP STEP
              </button>

              {/* Speed controls */}
              <div style={{ display: 'flex', gap: 3, marginLeft: 4, paddingLeft: 6, borderLeft: '1px solid #2A2926' }}>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSimSpeedCtl(s)}
                    className="tb-btn"
                    style={{
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: simSpeed === s ? 700 : 400,
                      background: simSpeed === s ? '#fecc2a' : undefined,
                      color: simSpeed === s ? '#0A0908' : undefined,
                      borderColor: simSpeed === s ? '#fecc2a' : undefined
                    }}
                    title={`${s}× simulation speed`}
                  >
                    {s}×
                  </button>
                ))}
              </div>

              <button
                onClick={stopSimulation}
                className="tb-btn"
                style={{ padding: '3px 10px', fontSize: 11, borderColor: '#C53D3D', color: '#C53D3D', marginLeft: 4 }}
              >
                ■ STOP
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Left Sidebar — Favorites + Recently Viewed + Rich list with copy/fav/flow indicators */}
          <div className="w-72 flex-shrink-0">
            <div className="metal rounded-2xl p-3">
              {/* Search (keyboard / support + clear) — now with command palette feel */}
              <div className="px-2 pb-2 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search... (/ focus) • cmds: random, reset, flow, home, popular"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const cmd = searchTerm.trim().toLowerCase()
                      let executed = false
                      if (cmd === 'random' || cmd === 'r') {
                        handleRandom()
                        executed = true
                      } else if (cmd === 'reset' || cmd === 'clear all') {
                        handleResetAll()
                        executed = true
                      } else if (cmd === 'flow' || cmd === 'simulate' || cmd === 'demo' || cmd === 'flows' || cmd === 'presets') {
                        setShowFlowPresets(true)
                        executed = true
                      } else if (cmd === 'home') {
                        if (isSimulating) { abortCurrentSimulation(); showToast({ type: 'info', title: 'Simulation aborted', message: 'Command nav takes over', duration: 800 }) }
                        handleNavigate('core-home')
                        executed = true
                      } else if (cmd === 'popular' || cmd === 'top') {
                        if (isSimulating) { abortCurrentSimulation(); showToast({ type: 'info', title: 'Simulation aborted', message: 'Command nav takes over', duration: 800 }) }
                        jumpToPopular()
                        executed = true
                      } else if (cmd.startsWith('go ')) {
                        const t = cmd.slice(3).trim()
                        const map: Record<string, string> = { home: 'core-home', search: 'core-search1', car: 'booking-choose-car', pickup: 'booking-confirm-pickup1', request: 'booking-requesting', trips: 'trips-hub', account: 'account-profile' }
                        if (map[t]) {
                          if (isSimulating) { abortCurrentSimulation(); showToast({ type: 'info', title: 'Simulation aborted', message: 'Command nav takes over', duration: 800 }) }
                          handleNavigate(map[t]); executed = true
                        }
                      }
                      if (executed) {
                        setSearchTerm('')
                        e.preventDefault()
                      }
                    }
                  }}
                  className="w-full bg-[#0A0908] border border-[#2A2926] text-sm px-3 py-2 pr-8 rounded-lg console-font placeholder:text-[#6E6A61] focus:outline-none focus:border-[#fecc2a]/60"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E6A61] hover:text-[#fecc2a] text-lg leading-none" title="Clear search">×</button>
                )}
              </div>

              {/* Category filters — now with counts for premium clarity */}
              <div className="flex flex-wrap gap-1 px-2 pb-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-colors console-font ${
                      activeCategory === cat ? 'bg-[#fecc2a] text-[#0A0908] border-[#fecc2a]' : 'border-[#2A2926] text-[#B8B5B0] hover:text-[#EDEBE5]'
                    }`}
                  >
                    {cat} <span className="opacity-60">({categoryCounts[cat] || 0})</span>
                  </button>
                ))}
              </div>

              {/* FAVORITES */}
              {favPages.length > 0 && (
                <div className="px-2 pt-1 pb-2">
                  <div className="section-label text-[9px] pl-1 mb-1 text-[#fecc2a]">★ FAVORITES ({favPages.length})</div>
                  <div className="space-y-0.5 max-h-[92px] overflow-y-auto pr-1">
                    {favPages.map(page => (
                      <PageListItem key={page.id} page={page} isSelected={selectedPage?.id === page.id} isFavorite isInFlow={flowHistory.includes(page.id)} onSelect={handleSelectPage} onToggleFavorite={toggleFavorite} onCopyLink={copyLinkFor} />
                    ))}
                  </div>
                </div>
              )}

              {/* RECENTLY VIEWED + flow indicators */}
              {recentPages.length > 0 && (
                <div className="px-2 pt-1 pb-2 border-t border-[#22211D]">
                  <div className="section-label text-[9px] pl-1 mb-1">RECENTLY VIEWED ({recentPages.length})</div>
                  <div className="space-y-0.5 max-h-[108px] overflow-y-auto pr-1">
                    {recentPages.map(page => (
                      <PageListItem key={page.id} page={page} isSelected={selectedPage?.id === page.id} isFavorite={favorites.includes(page.id)} isInFlow={flowHistory.includes(page.id)} onSelect={handleSelectPage} onToggleFavorite={toggleFavorite} onCopyLink={copyLinkFor} />
                    ))}
                  </div>
                </div>
              )}

              {/* BROWSE ALL (improved with per-item copy, star, flow dot) */}
              <div className="px-2 pt-2 border-t border-[#22211D]">
                <div className="section-label text-[9px] pl-1 mb-1 flex justify-between">
                  <span>BROWSE ALL ({filteredPages.length})</span>
                  <span className="text-[#6E6A61]">/ • 1-9</span>
                </div>
                <div className="max-h-[272px] overflow-y-auto pr-1 space-y-0.5 text-sm">
                  {filteredPages.length > 0 ? (
                    filteredPages.map(page => (
                      <PageListItem key={page.id} page={page} isSelected={selectedPage?.id === page.id} isFavorite={favorites.includes(page.id)} isInFlow={flowHistory.includes(page.id)} onSelect={handleSelectPage} onToggleFavorite={toggleFavorite} onCopyLink={copyLinkFor} />
                    ))
                  ) : (
                    <div className="px-3 py-4 text-[#6E6A61] text-xs">No matches — press Esc to clear</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 px-2 text-[9px] text-[#6E6A61] console-font tracking-[0.5px]">
              KEYS: / focus • Esc clear • 1–9 cats • R random • F fav • Enter on cmd (random/reset/flow)
            </div>
          </div>

          {/* Center: Device + integrated controls via toolbar */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-2 text-xs">
              <span className="section-label">DEVICE LAB</span>
              <span className="text-[#6E6A61]">•</span>
              <span className="console-font text-[#B8B5B0]">{showFrame ? 'HARDWARE FRAME' : 'FRAMELESS'} • 375×812</span>
            </div>

            {/* The Device (supports frame visibility toggle) */}
            <div
              className={showFrame ? "hardware-frame mx-auto transition-transform duration-300" : "mx-auto transition-transform duration-300"}
              style={{
                transform: `scale(${zoom}) rotate(${isRotated ? 90 : 0}deg)`,
                transformOrigin: 'center',
                ...(!showFrame && { width: 375, height: 812, background: '#11110F', borderRadius: 28, padding: 6, boxShadow: '0 0 0 1px #22221F, 0 30px 60px -15px rgba(0,0,0,0.55), inset 0 0 0 1px #2A2926' })
              }}
            >
              {showFrame ? (
                <div className="device-bevel relative">
                  <div className="absolute top-0 left-0 right-0 h-9 bg-gradient-to-b from-[#1F1F1C] to-transparent z-20 flex items-center justify-center">
                    <span className="text-[9px] text-[#B8B5B0] console-font tracking-[1.5px]">GODY LAB • REACT</span>
                  </div>
                  <div className="prototype-screen">
                    <div className="screen-content" style={{ background: '#F5F3ED' }}>
                      <PreviewErrorBoundary fallbackMessage="This prototype encountered a rendering error.">
                        {selectedPage ? (
                          <selectedPage.component onNavigate={handleNavigate} />
                        ) : pageId ? (
                          <NotFoundInDevice
                            pageId={pageId}
                            onNavigateHome={() => navigate('/')}
                            onTryRandom={handleRandom}
                          />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-[#0A0908] console-font text-sm px-6 text-center">
                            <div className="mb-3 text-2xl">📱</div>
                            <div>SELECT PROTOTYPE FROM LEFT</div>
                            <div className="mt-1 text-xs text-[#6E6A61]">Real React components • Zero iframes • Live flows</div>
                          </div>
                        )}
                      </PreviewErrorBoundary>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[108px] h-[5px] bg-[#2A2926] rounded-full z-30" />
                </div>
              ) : (
                <div className="prototype-screen border border-[#22221F]" style={{ borderRadius: 22, overflow: 'hidden' }}>
                  <div className="screen-content" style={{ background: '#F5F3ED', height: '100%' }}>
                    <PreviewErrorBoundary fallbackMessage="This prototype encountered a rendering error.">
                      {selectedPage ? (
                        <selectedPage.component onNavigate={handleNavigate} />
                      ) : pageId ? (
                        <NotFoundInDevice
                          pageId={pageId}
                          onNavigateHome={() => navigate('/')}
                          onTryRandom={handleRandom}
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[#0A0908] console-font text-sm px-6 text-center">
                          <div>FRAMELESS — SELECT PAGE</div>
                        </div>
                      )}
                    </PreviewErrorBoundary>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 text-xs text-[#B8B5B0] console-font">
              375 × 812 • iPhone 13 physical simulation • Real React components
              {!showFrame && <span className="ml-1 text-[#fecc2a]">• FRAMELESS</span>}
            </div>
          </div>

          {/* Right richer panel: related pages, start flow, meta, copy, fav */}
          <div className="w-80 flex-shrink-0">
            <InfoPanel
              selectedPage={selectedPage}
              favorites={favorites}
              flowHistory={flowHistory}
              onSelectPage={handleSelectPage}
              onToggleFavorite={toggleFavorite}
              onCopyLink={copyLinkFor}
              onCopyStandaloneLink={copyStandaloneLinkFor}
              onStartFlow={handleStartFlow}
            />

            {selectedPage && (
              <>
                <button
                  onClick={() => navigate(`/standalone/${selectedPage.id}`)}
                  className="mt-3 w-full py-2 text-xs console-font rounded-xl border border-[#2A2926] text-[#B8B5B0] hover:border-[#fecc2a] hover:text-[#fecc2a] transition-colors"
                >
                  ↗ OPEN STANDALONE FULLSCREEN PREVIEW
                </button>
                <button
                  onClick={handleCopyStandalone}
                  className="mt-1.5 w-full py-1.5 text-[10px] console-font rounded-lg border border-[#2A2926] text-[#B8B5B0] hover:border-[#fecc2a] hover:text-[#fecc2a] transition-colors"
                  title="Copy direct standalone deep link for sharing"
                >
                  📋 Copy Standalone Link
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========== FLOW SIMULATOR PRESETS MODAL (multi-flow powerhouse) ========== */}
        <Modal
          open={showFlowPresets}
          onClose={() => setShowFlowPresets(false)}
          title="FLOW SIMULATOR — DEMO PRESETS"
          width={440}
        >
          <div style={{ fontSize: 12, color: '#C9C6BE', marginBottom: 12, lineHeight: 1.4 }}>
            Powerful controllable journeys for stakeholder demos. All integrate deeply with DemoState + live toasts.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['standard', 'trip-mgmt', 'account-payment', 'full-e2e'] as const).map((key) => {
              const p = FLOW_PRESETS[key]
              return (
                <button
                  key={key}
                  onClick={() => runFlowPreset(key)}
                  className="tb-btn"
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderColor: '#3A3935',
                    background: 'linear-gradient(#1F1E1B, #151410)',
                    display: 'block',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#fecc2a', fontWeight: 700, fontSize: 13, letterSpacing: '0.3px' }}>{p.name}</div>
                      <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{p.desc}</div>
                    </div>
                    <div style={{ fontSize: 10, color: '#6E6A61', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {p.steps.length} STEPS<br />
                      <span style={{ color: '#fecc2a' }}>RUN →</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          <div style={{ marginTop: 14, fontSize: 10, color: '#6E6A61', textAlign: 'center' }}>
            While running: use Pause / Skip / 0.5×–2× speed controls in the bar above
          </div>
        </Modal>

        {/* ========== POST-SIMULATION CHOICE MODAL (Keep vs Reset) ========== */}
        <Modal
          open={showPostSimModal}
          onClose={() => setShowPostSimModal(false)}
          title="FLOW SIMULATION COMPLETE"
          width={400}
        >
          <div style={{ fontSize: 13, lineHeight: 1.45 }}>
            <div style={{ color: '#fecc2a', fontWeight: 600, marginBottom: 8 }}>{simPreset || 'Demo Flow'} finished successfully.</div>
            <div>A rich, realistic demo trip is now live in <strong>DemoState</strong> (visible in the floating inspector).</div>
            <div style={{ marginTop: 10, opacity: 0.85 }}>What would you like to do with the injected data?</div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setShowPostSimModal(false)
                showToast({ type: 'success', title: 'Demo trip retained', message: 'Continue exploring prototypes with live state', duration: 2400 })
              }}
              className="tb-btn"
              style={{ flex: '1 1 140px', background: '#fecc2a', color: '#0A0908', fontWeight: 600, borderColor: '#fecc2a', padding: '10px 14px' }}
            >
              ✓ KEEP DEMO TRIP
            </button>
            <button
              onClick={() => {
                resetDemoState()
                setShowPostSimModal(false)
                showToast({ type: 'info', title: 'Demo state reset', message: 'Clean slate for next demo run', duration: 2200 })
              }}
              className="tb-btn"
              style={{ flex: '1 1 140px', padding: '10px 14px' }}
            >
              RESET AFTER DEMO
            </button>
            <button
              onClick={() => setShowPostSimModal(false)}
              className="tb-btn"
              style={{ flex: '1 1 80px', padding: '10px 14px' }}
            >
              CLOSE
            </button>
          </div>
          <div style={{ marginTop: 10, fontSize: 10, color: '#6E6A61', textAlign: 'center' }}>
            Inspector + recent actions log updated • Ready for manual interaction or rerun
          </div>
        </Modal>
      </div>
    </div>
  )
}

// --- Standalone View (/# /standalone/:pageId) for clean full-screen preview ---
function StandaloneView() {
  const { pageId } = useParams<{ pageId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { resetDemoState } = useDemoState()

  const selectedPage: PageDefinition | null = pageId
    ? (findPageById(pageId) ?? null)
    : null

  // Standalone onNavigate: stays in /standalone/ + validates target (perfect sync + graceful)
  const handleNavigate = (targetId: string) => {
    const target = findPageById(targetId)
    if (target) {
      navigate(`/standalone/${targetId}`)
    } else {
      showToast({ type: 'error', title: 'Navigation failed', message: `No prototype “${targetId}”` })
    }
  }

  // Local random for standalone (keeps user in standalone mode)
  const handleRandomStandalone = () => {
    const rand = pageRegistry[Math.floor(Math.random() * pageRegistry.length)]
    navigate(`/standalone/${rand.id}`)
    showToast({ type: 'info', title: 'Random standalone', message: rand.title })
  }

  // Standalone copy actions (use toast, access ensured via root providers)
  const handleCopyLabFromSA = () => {
    if (!selectedPage) return
    const url = `${window.location.origin}${window.location.pathname}#/prototype/${selectedPage.id}`
    navigator.clipboard.writeText(url).then(() => {
      showToast({ type: 'success', title: 'Lab link copied', message: selectedPage.title })
    }).catch(() => {
      showToast({ type: 'warning', title: 'Clipboard unavailable', message: `Copy manually: ${url}`, duration: 7000 })
      console.log('[Clipboard fallback] Copy lab link:', url)
    })
  }
  const handleCopyStandaloneFromSA = () => {
    if (!selectedPage) return
    const url = `${window.location.origin}${window.location.pathname}#/standalone/${selectedPage.id}`
    navigator.clipboard.writeText(url).then(() => {
      showToast({ type: 'success', title: 'Standalone link copied', message: `${selectedPage.title} fullscreen` })
    }).catch(() => {
      showToast({ type: 'warning', title: 'Clipboard unavailable', message: `Copy manually: ${url}`, duration: 7000 })
      console.log('[Clipboard fallback] Copy standalone link:', url)
    })
  }

  const handleResetDemoFromSA = () => {
    resetDemoState()
    showToast({ type: 'success', title: 'Demo state reset', message: 'Prototype data cleared for clean testing' })
  }

  return (
    <div className="min-h-screen bg-[#0A0908] text-[#EDEBE5] flex flex-col">
      {/* Polished minimal standalone top bar with useful actions + toast feedback */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-[#2A2926] bg-[#11110F]">
        <div className="flex items-center gap-x-3">
          <div className="w-6 h-6 bg-[#fecc2a] flex items-center justify-center">
            <div className="w-3 h-3 bg-[#0A0908]" />
          </div>
          <span className="display-font text-xl font-bold tracking-[-1px]">GODY</span>
          <span className="section-label text-[10px] ml-1 tracking-[2px] text-[#B8B5B0]">STANDALONE</span>
          {pageId && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1F1E1B] text-[#fecc2a] console-font ml-1">{pageId}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm console-font flex-wrap">
          {selectedPage && (
            <span className="text-[#fecc2a] text-xs mr-1 hidden md:inline max-w-[140px] truncate">{selectedPage.title}</span>
          )}

          {/* Core minimal actions */}
          <button onClick={() => navigate(selectedPage ? `/prototype/${selectedPage.id}` : '/')} className="tb-btn">← Lab</button>

          {selectedPage && (
            <>
              <button onClick={handleCopyLabFromSA} className="tb-btn" title="Copy lab deep link">Copy Lab</button>
              <button onClick={handleCopyStandaloneFromSA} className="tb-btn" title="Copy standalone fullscreen link" style={{ borderColor: 'rgba(254,204,42,0.4)' }}>Copy Standalone</button>
            </>
          )}

          <button
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}#/standalone/${pageId || ''}`
              window.open(url, '_blank')
            }}
            className="tb-btn"
          >
            New tab
          </button>

          <button onClick={handleResetDemoFromSA} className="tb-btn" title="Reset global demo state (user, trip, payment)">Reset Demo</button>
        </div>
      </div>

      {/* Always render inside a device frame for consistent delightful experience — not-found lives inside too */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="flex flex-col items-center">
          <div className="hardware-frame mx-auto transition-transform duration-300" style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
            <div className="device-bevel relative">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#1F1F1C] to-transparent z-20 flex items-center justify-center">
                <span className="text-[9px] text-[#B8B5B0] console-font tracking-[1.5px]">GODY • STANDALONE PREVIEW</span>
              </div>

              <div className="prototype-screen">
                <div className="screen-content" style={{ background: '#F5F3ED' }}>
                  <PreviewErrorBoundary fallbackMessage="This prototype encountered a rendering error in standalone mode.">
                    {selectedPage ? (
                      <selectedPage.component onNavigate={handleNavigate} />
                    ) : pageId ? (
                      <NotFoundInDevice
                        pageId={pageId}
                        onNavigateHome={() => navigate('/')}
                        onTryRandom={handleRandomStandalone}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-[#0A0908] console-font text-sm px-6 text-center">
                        <div className="mb-2 text-xl">📱</div>
                        <div>No page selected</div>
                      </div>
                    )}
                  </PreviewErrorBoundary>
                </div>
              </div>

              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[108px] h-[5px] bg-[#2A2926] rounded-full z-30" />
            </div>
          </div>

          <div className="mt-3 text-[10px] text-[#6E6A61] console-font text-center">
            375×812 • Deep link: /standalone/{pageId || '…'} • Toast + DemoState available to prototypes
          </div>
        </div>
      </div>

      <div className="text-center py-3 text-[9px] text-[#6E6A61] console-font border-t border-[#2A2926]">
        HashRouter deep-link safe • Full providers (Toast / DemoState) • Perfect for sharing or embedding
      </div>
    </div>
  )
}

// Router root — App now purely wires HashRouter child routes
// Providers (ToastProvider + DemoStateProvider) are already at the root in main.tsx
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LabView />} />
        <Route path="/prototype/:pageId" element={<LabView />} />
        <Route path="/standalone/:pageId" element={<StandaloneView />} />
        <Route path="*" element={<LabView />} />
      </Routes>
      {/* Global floating Demo State inspector (works across lab + standalone previews) */}
      <DemoStateInspector />
    </>
  )
}

export default App
