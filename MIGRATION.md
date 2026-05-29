# GODY Prototypes → React + TS + Vite 迁移报告

**状态日期**: 2026-05-29 (最终完成 - Shared Components & Polish 协调)

## 核心原则（严格遵守）
- ✅ 所有页面由真实 React TSX 组件渲染（JSX + useState + 事件处理）
- ✅ 无 iframe（控制台预览区）
- ✅ 无 `dangerouslySetInnerHTML`
- ✅ 不依赖任何静态 HTML 目录作为最终显示
- ✅ 原始静态 HTML 已移入 `legacy-html/`（仅对照 + 回退）
- ✅ 视觉、尺寸（375×812 / 858）、交互逻辑 高度保真
- ✅ `npm run build` 通过 + TypeScript 无错误
- ✅ 导航通过 `onNavigate(pageId)` 实现真实页面切换 demo

## 已迁移页面（真实 React 组件）

**全部 44/44 页面已完成真实 React + TSX 迁移**（零占位页面用于主列表）。

由页面迁移批次 + Shared Components & Polish agent 共同完成。

| 分类     | 数量 | 示例 ID                          | 状态   |
|----------|------|----------------------------------|--------|
| Auth     | 2    | auth-login, auth-signup          | ✅ 100% |
| Core     | 4    | core-home, core-notification 等  | ✅ 100% |
| Booking  | 12   | booking-*-* (choose, confirm*, schedule, requesting) | ✅ 100% |
| Payment  | 2    | payment-select, payment-confirm  | ✅ 100% |
| Trips    | 11   | trips-*, trip-* (所有详情/列表)  | ✅ 100% |
| Account  | 5    | account-* (profile, edit, index) | ✅ 100% |
| Map      | 5    | map-*, rental-cost 等            | ✅ 100% |
| Other    | 2    | other-evaluate*                  | ✅ 100% |
| **总计** | **44** | - | **✅ 100%** |

所有页面均使用 `onNavigate(pageId)` 实现真实流转。许多复用新共享组件（见下）。

## 占位页面

**零个**。`PlaceholderPage` 组件仍保留在 `pageRegistry.tsx` 中（用于未来扩展或边缘情况），但主 registry 列表中 0 处引用。动态占位会正确报告 44/44 已迁移进度。

完整列表见 `src/pageRegistry.tsx`（与原 JSON 一致，全部映射真实组件）。

## 架构亮点

- `src/pageRegistry.tsx` — 单一事实来源（typed），现已 100% 接线真实组件；Placeholder 保持动态计数
- `src/components/mobile/` — 增强 StatusBar/TopNav + 新共享：**VehicleCard, TripCard, PaymentCard, StarRating, MapMock（可配置 pins/routes）, LoadingState** 等
- `src/styles/prototypes.css` — 大幅扩展共享类（trip-card, driver-info-card, star-rating, option-card, form-field, toggle, loading-overlay, badge-*, map-pin/route 等）
- 每页可有独立的 `*.module.css`
- 所有页面组件接收 `onNavigate?: (id: string) => void` prop，实现 demo 流转
- 完全移除 iframe / dangerouslySetInnerHTML；原 HTML 原型 100% 保留在 `legacy-html/` 作为参考

## 后续迁移建议（按优先级）

**全部完成！** 44 个页面已由批次迁移代理 + Shared Components & Polish 协调完成。

未来如需扩展新原型，只需：
1. 在 `src/pages/<cat>/NewPage.tsx` 创建真实组件（使用共享 mobile/* + prototypes.css）
2. 在 `src/pageRegistry.tsx` 添加 import + 条目（使用真实组件而非 Placeholder）
3. 更新 MIGRATION.md + 运行 `npm run build && npm run lint`

## 验收结果（当前会话结束时）

- `npm install`：通过（无新增依赖）
- `npm run dev`：通过
- `npm run build`：通过（无 TS 错误）
- `npm run lint`：通过（0 errors）
- React 控制台 100% 使用真实 React 组件渲染全部 44 个页面（零 PlaceholderPage 出现在主列表）
- 所有页面支持通过 `onNavigate` 互相跳转（完整真实 demo 流：登录→首页→选车/搜索→确认行程/上车点→支付→评价→行程列表等）
- 新共享组件（VehicleCard / MapMock / StarRating / PaymentCard / LoadingState 等）被多页采用，消除重复代码
- `src/styles/prototypes.css` 大幅增强，可被所有页面直接复用
- `PlaceholderPage` 升级为动态工业风占位（实时显示已迁移 X/44 + 可点击列表）
- 原始 44 个 HTML 原型文件 100% 保留在 `legacy-html/prototypes/`
- 最终状态：控制台完全基于 React，无 iframe，无 innerHTML 注入

## 不再使用的方式（已彻底移除）

- 预览区 iframe 指向静态 HTML 目录
- dangerouslySetInnerHTML 注入整页 HTML
- 依赖静态文件作为主要呈现手段

---

**完成状态**：迁移工作已全部结束。控制台现为 100% 真实 React 应用。
共享组件、CSS 扩展、动态占位、完整 registry 接线、lint/build 清理均由 Shared Components & Polish agent 执行。
原始原型与迁移后代码并存，便于持续演进。
