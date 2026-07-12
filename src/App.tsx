import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import './index.css'
import './styles/prototypes.css'

// Registry + helpers
import pageRegistry, { findPageById, type PageDefinition, migratedCount } from './pageRegistry'

// Demo state + notifications
import { useDemoState, type DemoTrip, type DemoUser, type DemoPaymentMethod } from './context/DemoStateContext'
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
const CATEGORY_LIST = ['全部', '认证', '核心', '预订', '支付', '行程', '账户', '地图', '其他'] as const

// FLOW PRESETS defined at module scope (prevents stale closures in runFlowPreset useCallback + makes data stable for aggressive re-triggers)
const FLOW_PRESETS_DATA: Record<'standard' | 'trip-mgmt' | 'account-payment' | 'full-e2e', FlowPreset> = {
  standard: {
    name: '标准叫车流程',
    desc: '经典 5 步叫车演示 — 旗舰演示旅程',
    steps: [
      { id: 'core-home', title: '首页', desc: '用户打开应用 — 地图显示附近 14 辆可用新能源车' },
      { id: 'core-search1', title: '搜索', desc: '输入目的地「陆家嘴」。智能推荐与价格预估' },
      { id: 'booking-choose-car', title: '选择车辆', desc: '对比车型：小鹏 P7 ¥78、蔚来 ¥92、特斯拉 ¥105，选择高端' },
      { id: 'booking-confirm-pickup1', title: '确认上车点', desc: '在地图上钉选位置。约 8 秒匹配司机，锁定 ETA' },
      { id: 'booking-requesting', title: '请求中', desc: '广播叫车请求，实时司机响应，最终确认步骤' },
    ]
  },
  'trip-mgmt': {
    name: '行程管理流程',
    desc: '即将开始行程 → 详情 → 状态流转的真实演示',
    steps: [
      { id: 'trips-hub', title: '行程中心', desc: '打开行程管理总览，含数量与筛选' },
      { id: 'trips-upcoming', title: '进行中行程', desc: '查看 2 个已预约行程，点卡片看详情' },
      { id: 'trip-upcoming', title: '行程详情', desc: '查看路线、司机信息与实时跟踪。丰富演示数据', inject: { from: 'Hongqiao Airport T2', to: 'Puxi Riverside Promenade', driver: 'Wang Lei', vehicle: 'NIO ET7 • Obsidian', eta: '11 min', price: 118, status: 'upcoming' } },
      { id: 'trips-detail-completed', title: '完成行程', desc: '模拟行程结束，自动更新状态并生成收据', inject: { from: 'Hongqiao Airport T2', to: 'Puxi Riverside Promenade', driver: 'Wang Lei', vehicle: 'NIO ET7 • Obsidian', eta: 'Arrived', price: 118, status: 'completed' } },
      { id: 'trips-past', title: '历史行程', desc: '归档已完成行程，展示筛选与导出等真实功能' },
    ]
  },
  'account-payment': {
    name: '账户与支付流程',
    desc: '资料管理 → 支付方式选择与结账',
    steps: [
      { id: 'account-profile', title: '我的资料', desc: '查看会员等级、出行数据与快捷编辑' },
      { id: 'account-edit1', title: '编辑账户', desc: '更新手机与通知偏好，表单校验演示' },
      { id: 'payment-select', title: '支付方式', desc: '管理 Visa ••••4242、支付宝、微信并设置默认' },
      { id: 'payment-confirm', title: '确认支付', desc: '使用所选方式确认 ¥118 行程费用并生成收据' },
    ]
  },
  'full-e2e': {
    name: '完整端到端流程',
    desc: '完整 9 步用户生命周期（叫车 + 支付 + 管理 + 账户）',
    steps: [
      { id: 'core-home', title: '首页', desc: '一天开始 — 地图与快捷叫车' },
      { id: 'core-search1', title: '搜索', desc: '规划前往金融区的通勤' },
      { id: 'booking-choose-car', title: '选择车辆', desc: '为 45 公里行程选择高效电动车' },
      { id: 'booking-confirm-pickup1', title: '上车点', desc: '确认位置与司机分配' },
      { id: 'payment-confirm', title: '支付', desc: '在已保存卡片上预授权扣款' },
      { id: 'booking-requesting', title: '已发送请求', desc: '等待匹配 — 实时状态浮层' },
      { id: 'trips-upcoming', title: '我的行程', desc: '确认预约已出现在进行中列表' },
      { id: 'trip-upcoming', title: '实时详情', desc: '监控司机到达倒计时', inject: { from: 'Jing\'an Temple', to: 'Century Avenue Tower', driver: 'Chen Fang', vehicle: 'Li Auto L9 • Pearl', eta: '3 min', price: 64, status: 'in-progress' } },
      { id: 'account-profile', title: '账户检查', desc: '行程后查看更新的数据与积分' },
    ]
  }
}

// Graceful not-found rendered *inside* the device frame for bad deep links (both lab + standalone)
function NotFoundInDevice({ pageId, onNavigateHome, onTryRandom }: { pageId: string; onNavigateHome: () => void; onTryRandom?: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 text-center" style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--gody-amber-soft)', display: 'grid', placeItems: 'center', marginBottom: 12, fontSize: 20 }}>?</div>
      <div style={{ fontWeight: 650, fontSize: 15, letterSpacing: '-0.02em' }}>未找到原型</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, marginBottom: 14, lineHeight: 1.4 }}>
        「{pageId}」不在注册表中
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {onTryRandom && (
          <button type="button" onClick={onTryRandom} className="lab-btn lab-btn--primary" style={{ fontSize: 12, color: '#14110a' }}>
            随机试试
          </button>
        )}
        <button type="button" onClick={onNavigateHome} className="lab-btn" style={{ fontSize: 12, background: '#fff', color: 'var(--ink)', border: '1px solid var(--line-strong)' }}>
          ← 返回控制台
        </button>
      </div>
    </div>
  )
}

// --- Lab Console View (handles / and /prototype/:pageId) ---
function LabView() {
  const { pageId } = useParams<{ pageId?: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  // Full demo state access for premium features (reset + mutations for quick actions / simulator)
  // Now also full state read for Export + setters for robust Import restore
  const {
    user,
    selectedPayment,
    activeTrip,
    bookedTrips,
    recentActions,
    resetDemoState,
    setUser,
    setSelectedPayment,
    setActiveTrip,
    addRecentAction,
    bookTrip,
    clearBookedTrips,
  } = useDemoState()

  // Core UI state
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')
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
  const importFileRef = useRef<HTMLInputElement>(null)
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
      showToast({ type: 'success', title: isFav ? '已取消收藏' : '已加入收藏', message: pageRegistry.find(p => p.id === id)?.title })
      return next
    })
  }, [showToast])

  const copyLinkFor = useCallback((page: PageDefinition) => {
    const url = `${window.location.origin}${window.location.pathname}#/prototype/${page.id}`
    navigator.clipboard.writeText(url).then(() => {
      showToast({ type: 'success', title: '链接已复制', message: `${page.title} 深度链接` })
    }).catch(() => {
      showToast({ type: 'warning', title: '无法使用剪贴板', message: `请手动复制： ${url}`, duration: 7000 })
      console.log('[Clipboard fallback] Copy link:', url)
    })
  }, [showToast])

  // NEW: Standalone link copier (for the dedicated enhancement + toolbar + standalone chrome)
  const copyStandaloneLinkFor = useCallback((page: PageDefinition) => {
    const url = `${window.location.origin}${window.location.pathname}#/standalone/${page.id}`
    navigator.clipboard.writeText(url).then(() => {
      showToast({ type: 'success', title: '独立预览链接已复制', message: `${page.title} 全屏预览` })
    }).catch(() => {
      showToast({ type: 'warning', title: '无法使用剪贴板', message: `请手动复制： ${url}`, duration: 7000 })
      console.log('[Clipboard fallback] 复制独立预览链接:', url)
    })
  }, [showToast])

  const handleCopyCurrent = useCallback(() => { if (selectedPage) copyLinkFor(selectedPage) }, [selectedPage, copyLinkFor])
  const handleCopyStandalone = useCallback(() => { if (selectedPage) copyStandaloneLinkFor(selectedPage) }, [selectedPage, copyStandaloneLinkFor])

  const handleSelectPage = useCallback((page: PageDefinition) => {
    // Guard for rapid switching journey: abort active sim on manual sidebar/console selection to prevent nav fighting / confusing state
    if (isSimulating) {
      abortCurrentSimulation()
      showToast({ type: 'info', title: '模拟已中止', message: '已切换为手动导航', duration: 900 })
    }
    navigate(`/prototype/${page.id}`)
  }, [navigate, isSimulating, showToast])

  // Robust onNavigate handler from inside prototypes: syncs URL + shows toast on bad ids (prevents broken deep links)
  const handleNavigate = useCallback((targetId: string) => {
    const target = findPageById(targetId)
    if (target) {
      navigate(`/prototype/${targetId}`)
    } else {
      showToast({ type: 'error', title: '导航失败', message: `未找到原型「${targetId}」` })
    }
  }, [navigate, showToast])

  const handleRandom = useCallback(() => {
    // Guard for rapid switching / sim journeys: abort active sim on manual random to prevent conflicting navigation
    if (isSimulating) {
      abortCurrentSimulation()
      showToast({ type: 'info', title: '模拟已中止', message: '已切换为随机选择', duration: 900 })
    }
    const rand = pageRegistry[Math.floor(Math.random() * pageRegistry.length)]
    navigate(`/prototype/${rand.id}`)
    showToast({ type: 'info', title: '随机原型', message: rand.title })
  }, [navigate, showToast, isSimulating])

  const handleResetAll = useCallback(() => {
    ['gody-console-favorites','gody-console-recent','gody-console-flow','gody-console-frame','gody-console-zoom']
      .forEach(k => localStorage.removeItem(k))
    setFavorites([]); setRecentViewed([]); setFlowHistory([])
    setShowFrame(true); setZoom(1); setSearchTerm(''); setActiveCategory('全部')
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
    showToast({ type: 'success', title: '演示状态已全部重置', message: `控制台与全局演示已清空。${pageRegistry.length} 个页面就绪。` })
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
    showToast({ type: 'info', title: '用户流程已开始', message: `从 ${start.title} 开始` })
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
    addRecentAction('通过快捷操作加载真实演示行程（多行程）')
    showToast({ type: 'success', title: '演示行程已创建', message: '已写入 bookedTrips，可在检查器与行程页查看' })
  }, [bookTrip, addRecentAction, showToast])

  const jumpToPopular = useCallback(() => {
    handleNavigate('booking-choose-car')
    showToast({ type: 'info', title: '已跳转到热门页', message: '选车页 — 核心高流量原型' })
  }, [handleNavigate, showToast])

  // NEW: Seed multiple realistic trips for rich demo of the new bookedTrips system
  const seedMultiTrips = useCallback(() => {
    if (typeof clearBookedTrips === 'function') clearBookedTrips()
    bookTrip({ status: 'completed', from: 'Hongqiao Airport T2', to: 'Puxi Riverside', driver: 'Wang Lei', vehicle: 'NIO ET7', price: 118, eta: 'Arrived' })
    bookTrip({ status: 'upcoming', from: 'Jing\'an Temple', to: 'Century Avenue', driver: 'Chen Fang', vehicle: 'Li Auto L9', price: 64, eta: '14 min' })
    const t3 = bookTrip({ status: 'in-progress', from: 'The Bund', to: 'Zhangjiang Hi-Tech', driver: 'Zhao Min', vehicle: 'BYD Seal', price: 71, eta: '9 min' })
    addRecentAction(`已填充 3 条示例行程（当前：${t3.to}）`)
    showToast({ type: 'success', title: '已填充 3 条示例行程', message: '包含即将开始 / 进行中 / 已完成' })
    // Jump to trips hub to immediately see the result
    setTimeout(() => handleNavigate('trips-hub'), 650)
  }, [bookTrip, clearBookedTrips, addRecentAction, showToast, handleNavigate])

  // === NEW: Quick Demo Scenarios (rich, realistic one-click states for stakeholder demos) ===
  const loadScenario = useCallback((type: 'business-commute' | 'airport-family' | 'night-party' | 'multiple-trips') => {
    if (typeof clearBookedTrips === 'function') clearBookedTrips();

    if (type === 'business-commute') {
      setUser({ name: 'Li Wei', phone: '+86 138 0013 8000', avatar: '👨‍💼' });
      setSelectedPayment({ id: 'alipay-8888', type: 'alipay', label: '支付宝 ••••8888' });
      bookTrip({ status: 'completed', from: '静安寺', to: '陆家嘴金融中心', driver: '张师傅', vehicle: '小鹏P7', price: 68, eta: 'Arrived', paid: true });
      bookTrip({ status: 'in-progress', from: '静安寺', to: '陆家嘴金融中心', driver: '王师傅', vehicle: '小鹏G9', price: 72, eta: '6 min' });
      addRecentAction('已加载商务通勤场景');
    } else if (type === 'airport-family') {
      setUser({ name: 'Wang Family', phone: '+86 139 1234 5678', avatar: '👨‍👩‍👧' });
      setSelectedPayment({ id: 'visa-4242', type: 'visa', label: 'Visa •••• 4242' });
      bookTrip({ status: 'upcoming', from: '浦东机场 T2', to: '外滩', driver: '李师傅', vehicle: '理想L9', price: 145, eta: '25 min' });
      bookTrip({ status: 'completed', from: '虹桥机场 T1', to: '人民广场', driver: '赵师傅', vehicle: '特斯拉 Model Y', price: 98, eta: 'Arrived', paid: true });
      addRecentAction('已加载机场家庭场景');
    } else if (type === 'night-party') {
      setUser({ name: 'Chen Xiaoyu', phone: '+86 177 7777 7777', avatar: '🕺' });
      setSelectedPayment({ id: 'wechat-6666', type: 'wechat', label: '微信支付 ••••6666' });
      bookTrip({ status: 'in-progress', from: '新天地', to: '徐汇滨江', driver: '孙师傅', vehicle: '比亚迪汉', price: 45, eta: '11 min' });
      addRecentAction('已加载夜生活场景');
    } else if (type === 'multiple-trips') {
      setUser({ name: 'Demo Power User', phone: '+1 555 123 4567', avatar: '🚀' });
      bookTrip({ status: 'completed', from: 'Century Avenue', to: 'The Bund', price: 58, eta: 'Arrived', paid: true });
      bookTrip({ status: 'upcoming', from: 'Jingan Temple', to: 'Pudong Airport', price: 132, eta: 'Tomorrow 07:40' });
      bookTrip({ status: 'in-progress', from: 'Xintiandi', to: 'Zhangjiang', driver: 'Liu', vehicle: 'NIO ET5', price: 79, eta: '4 min' });
      addRecentAction('已加载多行程用户场景');
    }

    showToast({ type: 'success', title: '场景已加载', message: `完整演示状态已就绪：${type}` });
    setTimeout(() => handleNavigate('trips-hub'), 420);
  }, [clearBookedTrips, setUser, setSelectedPayment, bookTrip, addRecentAction, showToast, handleNavigate]);

  // === NEW: Export / Import Demo State (core of this task) ===
  // Robust, versioned, partial-tolerant, uses only existing context setters for restore.
  // Placed here after other quick-action helpers for logical grouping.

  const exportDemoState = useCallback(() => {
    try {
      const payload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        source: 'gody-lab-console',
        demoState: {
          user,
          selectedPayment,
          activeTrip,
          bookedTrips,
          recentActions,
        },
      }
      const jsonStr = JSON.stringify(payload, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const d = new Date()
      const ts = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`
      const filename = `gody-demo-state-${ts}.json`
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      addRecentAction(`已导出演示状态（${bookedTrips.length} 条行程）→ ${filename}`)
      showToast({
        type: 'success',
        title: '演示状态已导出',
        message: `${filename} · ${bookedTrips.length} 条行程 · ${recentActions.length} 条最近操作`,
      })
    } catch (err) {
      console.error('[Export Demo State] failed', err)
      showToast({ type: 'error', title: '导出失败', message: '无法序列化当前演示状态（见控制台）' })
    }
  }, [user, selectedPayment, activeTrip, bookedTrips, recentActions, addRecentAction, showToast])

  const handleImportDemoState = useCallback(() => {
    importFileRef.current?.click()
  }, [importFileRef])

  const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = (ev.target?.result as string) || ''
        const parsed = JSON.parse(text)

        // Flexible shape support: {version, demoState: {...}} or bare state root, or legacy
        let s: Record<string, unknown> | null = null
        const p = parsed as Record<string, unknown>
        if (p && p.demoState && typeof p.demoState === 'object') {
          s = p.demoState as Record<string, unknown>
        } else if (p && (p.user || p.selectedPayment || p.bookedTrips)) {
          s = p
        } else {
          throw new Error('Unrecognized demo state file format (expected demoState or root user/payment keys)')
        }

        // Graceful version handling
        if (parsed.version != null && parsed.version !== 1) {
          showToast({
            type: 'warning',
            title: '版本提示',
            message: `已导入 v${parsed.version}（当前为 v1）。已应用核心字段，其余数据已忽略。`,
          })
        }

        // Restore using ONLY existing setters (as required). Start clean for predictability.
        resetDemoState()

        if (s.user && typeof s.user === 'object') {
          setUser(s.user as Partial<DemoUser>) // accepts partial but full object is fine (spreads)
        }
        if (s.selectedPayment && typeof s.selectedPayment === 'object') {
          setSelectedPayment(s.selectedPayment as DemoPaymentMethod)
        }

        // Book each trip (ensures id gen/normalization + bookedTrips list + active focus)
        const trips = Array.isArray(s.bookedTrips) ? s.bookedTrips : []
        for (const t of trips) {
          if (t && t.from && t.to) {
            bookTrip({
              id: t.id,
              status: t.status,
              from: t.from,
              to: t.to,
              driver: t.driver,
              vehicle: t.vehicle,
              eta: t.eta,
              price: typeof t.price === 'number' ? t.price : undefined,
              paid: t.paid,
            })
          }
        }

        // Explicit activeTrip restore (supports null or specific trip not last-booked)
        if ('activeTrip' in s) {
          const at = (s as Record<string, unknown>).activeTrip
          setActiveTrip((at as DemoTrip | null) ?? null)
        }

        // Restore recent log in correct order (array[0]=newest; prepend in reverse)
        const rec = Array.isArray(s.recentActions) ? s.recentActions : []
        for (let i = rec.length - 1; i >= 0; i--) {
          if (typeof rec[i] === 'string') addRecentAction(rec[i])
        }

        const restoredTrips = trips.length
        const restoredActions = rec.length
        addRecentAction(`已从「${file.name}」导入演示状态（${restoredTrips} 条行程）`)
        const userName = (s.user as { name?: string } | undefined)?.name || '?'
        showToast({
          type: 'success',
          title: '演示状态已导入 ✓',
          message: `已恢复用户「${userName}」、${restoredTrips} 条行程、${restoredActions} 条操作，可开始演示。`,
          duration: 5200,
        })
      } catch (err: unknown) {
        console.error('[Import Demo State] parse/restore error', err)
        const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message?: unknown }).message) : ''
        showToast({
          type: 'error',
          title: '导入失败',
          message: msg || 'JSON 无效或演示状态文件不兼容。',
          duration: 6500,
        })
      } finally {
        // Allow re-selecting the same file
        ;(e.target as HTMLInputElement).value = ''
      }
    }
    reader.onerror = () => {
      showToast({ type: 'error', title: '读取错误', message: '无法读取所选文件。' })
      ;(e.target as HTMLInputElement).value = ''
    }
    reader.readAsText(file)
  }, [resetDemoState, setUser, setSelectedPayment, setActiveTrip, bookTrip, addRecentAction, showToast])

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
    addRecentAction(`流程模拟器已启动：${preset.name}`)

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
        title: `第 ${i + 1}/${preset.steps.length} 步 — ${step.title}`,
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
        addRecentAction(`模拟器：${step.title} → 已注入演示行程`)
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
      addRecentAction(`流程模拟器已完成：${preset.name}`)
      setShowPostSimModal(true)
    } else {
      addRecentAction('用户中断了流程模拟器')
    }
  }, [handleNavigate, showToast, addRecentAction, bookTrip, FLOW_PRESETS])

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
      title: c.paused ? '⏸ 模拟已暂停' : '▶ 模拟已继续',
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
    showToast({ type: 'info', title: '⏭ 已跳过本步', duration: 700 })
  }, [showToast])

  const setSimSpeedCtl = useCallback((newSpeed: number) => {
    const c = simCtrl.current
    c.speed = newSpeed
    setSimSpeed(newSpeed)
    showToast({ type: 'info', title: `速度设为 ${newSpeed}×`, message: '延迟已实时调整', duration: 850 })
  }, [showToast])

  const stopSimulation = useCallback(() => {
    abortCurrentSimulation()
    showToast({ type: 'warning', title: '■ 模拟已停止', message: '演示流程已中断 — 状态已保留' })
  }, [showToast])

  // Keyboard shortcuts: / focus, Esc clear, numbers for cats, R random, F fav. (export/import via command palette in search input)
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
      const matchesCategory = activeCategory === '全部' || p.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, activeCategory])

  // Derived
  const migrated = migratedCount()
  const total = pageRegistry.length

  const favPages = useMemo(() => pageRegistry.filter(p => favorites.includes(p.id)), [favorites])
  const recentPages = useMemo(() => recentViewed.map(id => pageRegistry.find(p => p.id === id)).filter(Boolean) as PageDefinition[], [recentViewed])
  const categories = useMemo(() => ['全部', ...Array.from(new Set(pageRegistry.map(p => p.category)))], [])

  // Category counts for clearer UI (premium search feel)
  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = { '全部': total }
    pageRegistry.forEach(p => {
      c[p.category] = (c[p.category] || 0) + 1
    })
    return c
  }, [total])

  return (
    <div className="lab-app">
      {/* Redesigned sticky header — brand + stats hierarchy */}
      <header className="lab-header">
        <div className="lab-brand">
          <div className="lab-logo" aria-hidden>
            <div className="lab-logo-mark" />
          </div>
          <div className="lab-brand-text">
            <div className="lab-brand-title">GODY 工作室</div>
            <div className="lab-brand-sub">原型实验室 · React</div>
          </div>
        </div>
        <StatsBar
          total={total}
          migrated={migrated}
          favoritesCount={favorites.length}
          recentCount={recentViewed.length}
          flowLength={flowHistory.length}
        />
      </header>

      <div className="lab-workspace">
        {/* LEFT: browse / filters */}
        <aside className="lab-nav">
          <div className="lab-nav-search">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="搜索页面…（/ 聚焦）"
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
                    if (isSimulating) { abortCurrentSimulation(); showToast({ type: 'info', title: '模拟已中止', message: '已切换为命令导航', duration: 800 }) }
                    handleNavigate('core-home')
                    executed = true
                  } else if (cmd === 'popular' || cmd === 'top') {
                    if (isSimulating) { abortCurrentSimulation(); showToast({ type: 'info', title: '模拟已中止', message: '已切换为命令导航', duration: 800 }) }
                    jumpToPopular()
                    executed = true
                  } else if (cmd === 'export' || cmd === 'export state' || cmd === 'save state') {
                    exportDemoState()
                    executed = true
                  } else if (cmd === 'import' || cmd === 'import state' || cmd === 'load state') {
                    handleImportDemoState()
                    executed = true
                  } else if (cmd === 'scenario' || cmd === 'scenarios') {
                    loadScenario('multiple-trips');
                    executed = true;
                  } else if (cmd.startsWith('go ')) {
                    const t = cmd.slice(3).trim()
                    const map: Record<string, string> = { home: 'core-home', search: 'core-search1', car: 'booking-choose-car', pickup: 'booking-confirm-pickup1', request: 'booking-requesting', trips: 'trips-hub', account: 'account-profile' }
                    if (map[t]) {
                      if (isSimulating) { abortCurrentSimulation(); showToast({ type: 'info', title: '模拟已中止', message: '已切换为命令导航', duration: 800 }) }
                      handleNavigate(map[t]); executed = true
                    }
                  }
                  if (executed) {
                    setSearchTerm('')
                    e.preventDefault()
                  }
                }
              }}
              className="console-search"
            />
            {searchTerm && (
              <button type="button" onClick={() => setSearchTerm('')} className="clear-btn" title="清除搜索">×</button>
            )}
          </div>

          <div className="lab-chip-row">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`lab-chip cat-chip${activeCategory === cat ? ' active lab-chip--active' : ''}`}
              >
                {cat} <span style={{ opacity: 0.65 }}>({categoryCounts[cat] || 0})</span>
              </button>
            ))}
          </div>

          {favPages.length > 0 && (
            <div className="lab-section">
              <div className="lab-section-head">
                <span className="section-label" style={{ color: 'var(--gody-amber-bright)' }}>收藏</span>
                <span className="section-label">{favPages.length}</span>
              </div>
              <div className="lab-list" style={{ maxHeight: 100 }}>
                {favPages.map(page => (
                  <PageListItem key={page.id} page={page} isSelected={selectedPage?.id === page.id} isFavorite isInFlow={flowHistory.includes(page.id)} onSelect={handleSelectPage} onToggleFavorite={toggleFavorite} onCopyLink={copyLinkFor} />
                ))}
              </div>
            </div>
          )}

          {recentPages.length > 0 && (
            <div className="lab-section">
              <div className="lab-section-head">
                <span className="section-label">最近浏览</span>
                <span className="section-label">{recentPages.length}</span>
              </div>
              <div className="lab-list" style={{ maxHeight: 120 }}>
                {recentPages.map(page => (
                  <PageListItem key={page.id} page={page} isSelected={selectedPage?.id === page.id} isFavorite={favorites.includes(page.id)} isInFlow={flowHistory.includes(page.id)} onSelect={handleSelectPage} onToggleFavorite={toggleFavorite} onCopyLink={copyLinkFor} />
                ))}
              </div>
            </div>
          )}

          <div className="lab-section" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="lab-section-head">
              <span className="section-label">浏览 · {filteredPages.length}</span>
              <span className="section-label">1–9 分类</span>
            </div>
            <div className="lab-list lab-list--tall">
              {filteredPages.length > 0 ? (
                filteredPages.map(page => (
                  <PageListItem key={page.id} page={page} isSelected={selectedPage?.id === page.id} isFavorite={favorites.includes(page.id)} isInFlow={flowHistory.includes(page.id)} onSelect={handleSelectPage} onToggleFavorite={toggleFavorite} onCopyLink={copyLinkFor} />
                ))
              ) : (
                <div className="lab-list-empty">无匹配结果 — 按 Esc 清空</div>
              )}
            </div>
          </div>

          <div className="lab-nav-hint">
            / 聚焦 · Esc 清空 · R 随机 · F 收藏 · Enter 执行命令
          </div>
        </aside>

        {/* CENTER: tools + device stage */}
        <main className="lab-stage">
          <div className="lab-stage-toolbar">
            <span className="lab-stage-label">画布</span>
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
              onSimulateFlow={simulateBookingFlow}
              onLoadDemoTrip={loadDemoTrip}
              onJumpPopular={jumpToPopular}
              onOpenFlowPresets={() => setShowFlowPresets(true)}
              onSeedMultiTrips={seedMultiTrips}
              onExportDemoState={exportDemoState}
              onImportDemoState={handleImportDemoState}
            />
          </div>

          <input
            ref={importFileRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            style={{ display: 'none' }}
            aria-hidden="true"
          />

          {!isSimulating && (
            <div className="lab-scenarios">
              <span className="lab-scenarios-label">演示场景</span>
              <button type="button" onClick={() => loadScenario('business-commute')} className="lab-btn" style={{ fontSize: 11, padding: '4px 10px' }}>商务通勤</button>
              <button type="button" onClick={() => loadScenario('airport-family')} className="lab-btn" style={{ fontSize: 11, padding: '4px 10px' }}>机场家庭</button>
              <button type="button" onClick={() => loadScenario('night-party')} className="lab-btn" style={{ fontSize: 11, padding: '4px 10px' }}>夜生活</button>
              <button type="button" onClick={() => loadScenario('multiple-trips')} className="lab-btn" style={{ fontSize: 11, padding: '4px 10px' }}>多行程混合</button>
            </div>
          )}

          {isSimulating && (
            <div className="lab-sim-bar">
              <div className="lab-sim-title">● 实时演示</div>
              <div className="lab-sim-meta">
                {simPreset} · Step <strong style={{ color: 'var(--gody-amber-bright)' }}>{simStep}</strong>/{simTotal}
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <button type="button" onClick={toggleSimPause} className="lab-btn lab-btn--primary" style={{ padding: '5px 12px' }}>
                  {simPaused ? '▶ 继续' : '⏸ 暂停'}
                </button>
                <button type="button" onClick={skipSimStep} className="lab-btn" style={{ padding: '5px 12px' }}>跳过</button>
                <div style={{ display: 'flex', gap: 4, marginLeft: 4, paddingLeft: 8, borderLeft: '1px solid var(--lab-border)' }}>
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSimSpeedCtl(s)}
                      className={`lab-btn${simSpeed === s ? ' lab-btn--active active' : ''}`}
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      title={`${s}× speed`}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
                <button type="button" onClick={stopSimulation} className="lab-btn lab-btn--danger" style={{ padding: '5px 12px' }}>
                  Stop
                </button>
              </div>
            </div>
          )}

          <div className="lab-device-wrap">
            <div
              className={showFrame ? 'hardware-frame transition-transform duration-300' : 'transition-transform duration-300'}
              style={{
                transform: `scale(${zoom}) rotate(${isRotated ? 90 : 0}deg)`,
                transformOrigin: 'center',
                ...(!showFrame && {
                  width: 375,
                  height: 812,
                  background: '#0c0e14',
                  borderRadius: 28,
                  padding: 6,
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 30px 60px -15px rgba(0,0,0,0.55)',
                }),
              }}
            >
              {showFrame ? (
                <div className="device-bevel relative">
                  <div className="absolute top-0 left-0 right-0 h-7 z-20 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] text-white/30 tracking-[0.14em] uppercase font-medium">GODY</span>
                  </div>
                  <div className="prototype-screen">
                    <div className="screen-content" style={{ background: 'var(--paper)' }}>
                      <PreviewErrorBoundary fallbackMessage="此原型渲染出错。">
                        {selectedPage ? (
                          <selectedPage.component onNavigate={handleNavigate} />
                        ) : pageId ? (
                          <NotFoundInDevice
                            pageId={pageId}
                            onNavigateHome={() => navigate('/')}
                            onTryRandom={handleRandom}
                          />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-[var(--ink)] px-8 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            <div className="mb-3 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gody-amber-soft)', color: 'var(--gody-amber)' }}>
                              <span style={{ fontSize: 22 }}>◇</span>
                            </div>
                            <div style={{ fontWeight: 650, fontSize: 15, letterSpacing: '-0.02em' }}>请选择原型</div>
                            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted)', lineHeight: 1.45 }}>
                              从左侧列表选择 — 真实 React 页面，实时演示状态，无 iframe。
                            </div>
                          </div>
                        )}
                      </PreviewErrorBoundary>
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[108px] h-[4px] bg-white/15 rounded-full z-30" />
                </div>
              ) : (
                <div className="prototype-screen" style={{ borderRadius: 22, overflow: 'hidden', position: 'relative', inset: 'auto', width: '100%', height: '100%' }}>
                  <div className="screen-content" style={{ background: 'var(--paper)', height: '100%' }}>
                    <PreviewErrorBoundary fallbackMessage="此原型渲染出错。">
                      {selectedPage ? (
                        <selectedPage.component onNavigate={handleNavigate} />
                      ) : pageId ? (
                        <NotFoundInDevice
                          pageId={pageId}
                          onNavigateHome={() => navigate('/')}
                          onTryRandom={handleRandom}
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-[var(--ink)] text-sm px-6 text-center">
                          <div style={{ fontWeight: 600 }}>无边框模式 — 请选择页面</div>
                        </div>
                      )}
                    </PreviewErrorBoundary>
                  </div>
                </div>
              )}
            </div>

            <div className="lab-device-caption">
              375 × 812 · {showFrame ? '设备边框' : '无边框'} · 真实 React 组件
              {selectedPage ? ` · ${selectedPage.title}` : ''}
            </div>
          </div>
        </main>

        {/* RIGHT: meta */}
        <aside className="lab-aside">
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
                type="button"
                onClick={() => navigate(`/standalone/${selectedPage.id}`)}
                className="lab-meta-link"
              >
                打开全屏预览 →
              </button>
              <button
                type="button"
                onClick={handleCopyStandalone}
                className="lab-meta-link"
                style={{ marginTop: 8 }}
              >
                复制独立预览链接
              </button>
            </>
          )}
        </aside>
      </div>

      <Modal
        open={showFlowPresets}
        onClose={() => setShowFlowPresets(false)}
        title="流程模拟器 — 预设"
        width={440}
      >
        <div style={{ fontSize: 13, color: 'var(--lab-text-secondary)', marginBottom: 14, lineHeight: 1.45 }}>
          可控演示旅程，联动 DemoState 与实时提示。
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(['standard', 'trip-mgmt', 'account-payment', 'full-e2e'] as const).map((key) => {
            const p = FLOW_PRESETS[key]
            return (
              <button
                key={key}
                type="button"
                onClick={() => runFlowPreset(key)}
                className="lab-btn"
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: 14,
                  display: 'block',
                  width: '100%',
                  whiteSpace: 'normal',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ color: 'var(--gody-amber-bright)', fontWeight: 650, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginTop: 3 }}>{p.desc}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--lab-text-muted)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {p.steps.length} 步
                    <div style={{ color: 'var(--gody-amber)', marginTop: 2 }}>运行 →</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Modal>

      <Modal
        open={showPostSimModal}
        onClose={() => setShowPostSimModal(false)}
        title="模拟完成"
        width={400}
      >
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>
          <div style={{ color: 'var(--gody-amber-bright)', fontWeight: 600, marginBottom: 8 }}>{simPreset || 'Demo flow'} 已完成。</div>
          <div>一条真实演示行程已写入 <strong>DemoState</strong>。</div>
          <div style={{ marginTop: 10, opacity: 0.85 }}>保留注入数据，还是重置以便下次演示？</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setShowPostSimModal(false)
              showToast({ type: 'success', title: '已保留演示行程', message: '可继续使用当前实时状态探索', duration: 2400 })
            }}
            className="lab-btn lab-btn--primary"
            style={{ flex: '1 1 140px', padding: '10px 14px' }}
          >
            保留演示行程
          </button>
          <button
            type="button"
            onClick={() => {
              resetDemoState()
              setShowPostSimModal(false)
              showToast({ type: 'info', title: '演示状态已重置', message: '已清空，可开始下次演示', duration: 2200 })
            }}
            className="lab-btn"
            style={{ flex: '1 1 140px', padding: '10px 14px' }}
          >
            演示后重置
          </button>
          <button type="button" onClick={() => setShowPostSimModal(false)} className="lab-btn" style={{ flex: '1 1 80px', padding: '10px 14px' }}>
            Close
          </button>
        </div>
      </Modal>
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
      showToast({ type: 'error', title: '导航失败', message: `未找到原型「${targetId}」` })
    }
  }

  // Local random for standalone (keeps user in standalone mode)
  const handleRandomStandalone = () => {
    const rand = pageRegistry[Math.floor(Math.random() * pageRegistry.length)]
    navigate(`/standalone/${rand.id}`)
    showToast({ type: 'info', title: '随机独立预览', message: rand.title })
  }

  // Standalone copy actions (use toast, access ensured via root providers)
  const handleCopyLabFromSA = () => {
    if (!selectedPage) return
    const url = `${window.location.origin}${window.location.pathname}#/prototype/${selectedPage.id}`
    navigator.clipboard.writeText(url).then(() => {
      showToast({ type: 'success', title: '实验室链接已复制', message: selectedPage.title })
    }).catch(() => {
      showToast({ type: 'warning', title: '无法使用剪贴板', message: `请手动复制： ${url}`, duration: 7000 })
      console.log('[Clipboard fallback] 复制实验室链接 link:', url)
    })
  }
  const handleCopyStandaloneFromSA = () => {
    if (!selectedPage) return
    const url = `${window.location.origin}${window.location.pathname}#/standalone/${selectedPage.id}`
    navigator.clipboard.writeText(url).then(() => {
      showToast({ type: 'success', title: '独立预览链接已复制', message: `${selectedPage.title} fullscreen` })
    }).catch(() => {
      showToast({ type: 'warning', title: '无法使用剪贴板', message: `请手动复制： ${url}`, duration: 7000 })
      console.log('[Clipboard fallback] 复制独立预览链接:', url)
    })
  }

  const handleResetDemoFromSA = () => {
    resetDemoState()
    showToast({ type: 'success', title: '演示状态已重置', message: '原型数据已清空，便于干净测试' })
  }

  return (
    <div className="standalone-app">
      <div className="standalone-bar">
        <div className="lab-brand">
          <div className="lab-logo" style={{ width: 28, height: 28, borderRadius: 8 }}>
            <div className="lab-logo-mark" style={{ width: 10, height: 10 }} />
          </div>
          <div className="lab-brand-text">
            <div className="lab-brand-title" style={{ fontSize: 15 }}>GODY</div>
            <div className="lab-brand-sub">独立预览</div>
          </div>
          {pageId && (
            <span className="lab-stat-pill lab-stat-pill--accent" style={{ marginLeft: 8 }}>{pageId}</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {selectedPage && (
            <span style={{ fontSize: 12, color: 'var(--gody-amber-bright)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedPage.title}
            </span>
          )}
          <button type="button" onClick={() => navigate(selectedPage ? `/prototype/${selectedPage.id}` : '/')} className="lab-btn">← 实验室</button>
          {selectedPage && (
            <>
              <button type="button" onClick={handleCopyLabFromSA} className="lab-btn">复制实验室链接</button>
              <button type="button" onClick={handleCopyStandaloneFromSA} className="lab-btn">复制独立链接</button>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}#/standalone/${pageId || ''}`
              window.open(url, '_blank')
            }}
            className="lab-btn"
          >
            新标签页
          </button>
          <button type="button" onClick={handleResetDemoFromSA} className="lab-btn">重置演示</button>
        </div>
      </div>

      <div className="standalone-stage">
        <div className="lab-device-wrap">
          <div className="hardware-frame" style={{ transform: 'scale(1)', transformOrigin: 'center' }}>
            <div className="device-bevel relative">
              <div className="prototype-screen">
                <div className="screen-content" style={{ background: 'var(--paper)' }}>
                  <PreviewErrorBoundary fallbackMessage="独立预览模式下此原型渲染出错。">
                    {selectedPage ? (
                      <selectedPage.component onNavigate={handleNavigate} />
                    ) : pageId ? (
                      <NotFoundInDevice
                        pageId={pageId}
                        onNavigateHome={() => navigate('/')}
                        onTryRandom={handleRandomStandalone}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-[var(--ink)] text-sm px-6 text-center">
                        <div style={{ fontWeight: 600 }}>未选择页面</div>
                      </div>
                    )}
                  </PreviewErrorBoundary>
                </div>
              </div>
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[108px] h-[4px] bg-white/15 rounded-full z-30" />
            </div>
          </div>
          <div className="lab-device-caption">
            375×812 · /standalone/{pageId || '…'}
          </div>
        </div>
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
