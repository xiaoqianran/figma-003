import React from 'react';

/* eslint-disable react-refresh/only-export-components */

// Import all real migrated page components (100% coverage - wired by Shared Components & Polish agent)
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

import HomePage from './pages/core/HomePage';
import NotificationPage from './pages/core/NotificationPage';
import Search1Page from './pages/core/Search1Page';
import Search2Page from './pages/core/Search2Page';

import ChooseCarPage from './pages/booking/ChooseCarPage';
import ChooseTrip1Page from './pages/booking/ChooseTrip1Page';
import ChooseTrip2Page from './pages/booking/ChooseTrip2Page';
import ConfirmGodyxPage from './pages/booking/ConfirmGodyxPage';
import ConfirmPickup1Page from './pages/booking/ConfirmPickup1Page';
import ConfirmPickup2Page from './pages/booking/ConfirmPickup2Page';
import ConfirmPickup3Page from './pages/booking/ConfirmPickup3Page';
import ConfirmPickup4Page from './pages/booking/ConfirmPickup4Page';
import ConfirmPickup5Page from './pages/booking/ConfirmPickup5Page';
import ConfirmPickup6Page from './pages/booking/ConfirmPickup6Page';
import ConfirmPickup7Page from './pages/booking/ConfirmPickup7Page';
import RequestingPage from './pages/booking/RequestingPage';
import SchedulePage from './pages/booking/SchedulePage';

import SelectPaymentPage from './pages/payment/SelectPaymentPage';
import ConfirmPaymentPage from './pages/payment/ConfirmPaymentPage';

import TripsIndexPage from './pages/trips/TripsIndexPage';
import TripTestPage from './pages/trips/TripTestPage';
import TripDetailCancelledPage from './pages/trips/TripDetailCancelledPage';
import TripDetailCompletedPage from './pages/trips/TripDetailCompletedPage';
import TripDetailHelpPage from './pages/trips/TripDetailHelpPage';
import YourTripsPastPage from './pages/trips/YourTripsPastPage';
import YourTripsUpcomingPage from './pages/trips/YourTripsUpcomingPage';
import TripIndexPage from './pages/trips/TripIndexPage';
import PickupCountdownPage from './pages/trips/PickupCountdownPage';
import SchedulingTripPage from './pages/trips/SchedulingTripPage';
import UpcomingTripPage from './pages/trips/UpcomingTripPage';

import ProfilePage from './pages/account/ProfilePage';
import EditAccount1Page from './pages/account/EditAccount1Page';
import EditAccount2Page from './pages/account/EditAccount2Page';
import AccountIndexPage from './pages/account/AccountIndexPage';
import AccountTestPage from './pages/account/AccountTestPage';

import MapIndexPage from './pages/map/MapIndexPage';
import MapHomePage from './pages/map/MapHomePage';
import RouteMapPage from './pages/map/RouteMapPage';
import HelpMapPage from './pages/map/HelpMapPage';
import RentalCostPage from './pages/map/RentalCostPage';

import Evaluate1Page from './pages/other/Evaluate1Page';
import Evaluate2Page from './pages/other/Evaluate2Page';

export interface PageDefinition {
  id: string;
  title: string;
  category: string;
  path: string; // original static path for reference
  description: string;
  component: React.ComponentType<{ onNavigate?: (pageId: string) => void }>;
}

// Temporary placeholder for unmigrated pages - shows a "not yet migrated" message
// This allows the full list to remain usable in the console while we migrate batch by batch.
// Dynamically detects real components (vs PlaceholderPage) using getMigratedPages() for accurate "X/44" count.
// Declared as function (hoisted) so references inside registry array + helpers are safe.
function PlaceholderPage({ onNavigate }: { onNavigate?: (pageId: string) => void }) {
  // Dynamic computation using exported safe helpers — updates automatically when registry is patched after batches
  const realPages = getMigratedPages();
  const count = migratedCount();
  const total = pageRegistry.length;

  return (
    <div className="mobile-frame" style={{ background: '#F5F3ED', display: 'flex', flexDirection: 'column', fontFamily: 'Roboto, system-ui, sans-serif' }}>
      <div style={{ padding: '32px 20px 16px', textAlign: 'center', color: '#0A0908' }}>
        {/* Industrial header */}
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 8, 
          background: '#0A0908', color: '#fecc2a', padding: '4px 14px', borderRadius: 999, 
          fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', marginBottom: 16 
        }}>
          GODY LAB • REACT
        </div>

        <div style={{ fontSize: 42, marginBottom: 8 }}>🚧</div>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.3px' }}>页面施工中</div>
        
        <div style={{ fontSize: 12, color: '#6E6A61', lineHeight: 1.55, maxWidth: 260, margin: '0 auto' }}>
          此原型正在迁移为真实 React 组件。<br />目前显示占位界面。
        </div>

        {/* Progress */}
        <div style={{ marginTop: 20, padding: '10px 16px', background: '#fff', borderRadius: 12, border: '1px solid #e8e4d9', display: 'inline-block', minWidth: 210 }}>
          <div style={{ fontSize: 11, color: '#6E6A61', marginBottom: 4 }}>MIGRATION PROGRESS</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0A0908' }}>
            已迁移 <span style={{ color: '#fecc2a' }}>{count}</span> / {total}
          </div>
        </div>

        {/* Dynamic list of real migrated pages */}
        {realPages.length > 0 && (
          <div style={{ marginTop: 18, textAlign: 'left', maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#959595', marginBottom: 6, paddingLeft: 4 }}>已完成真实组件</div>
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e4d9', padding: '6px 4px', maxHeight: 118, overflowY: 'auto' }}>
              {realPages.map((p: PageDefinition) => (
                <button
                  key={p.id}
                  onClick={() => onNavigate && onNavigate(p.id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '5px 10px', fontSize: 12,
                    background: 'transparent', border: 'none', color: '#0A0908', cursor: 'pointer',
                    borderRadius: 6
                  }}
                  className="hover:bg-[#fffdf5]"
                >
                  <span style={{ color: '#fecc2a', marginRight: 6 }}>●</span>
                  {p.title} <span style={{ color: '#959595', fontSize: 10 }}>({p.category})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', padding: '16px 20px 22px' }}>
        <button
          onClick={() => onNavigate && onNavigate('auth-login')}
          style={{
            width: '100%',
            padding: '13px 0',
            background: '#fecc2a',
            color: '#0A0908',
            border: 'none',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
          }}
        >
          跳转至已迁移页面：登录
        </button>
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 10, color: '#959595' }}>
          点击上方列表可直接预览其他真实页面
        </div>
      </div>
    </div>
  );
}

// This is the source of truth for the React console.
// It mirrors the shape of the original JSON but replaces path with real component.
export const pageRegistry: PageDefinition[] = [
  {
    id: "auth-login",
    title: "登录",
    category: "Auth",
    path: "login-page/index.html",
    description: "GODY 应用登录入口，支持手机号与社交账号快速登录。",
    component: LoginPage,
  },
  {
    id: "auth-signup",
    title: "注册",
    category: "Auth",
    path: "signup-page/index.html",
    description: "新用户注册页面，通过手机号完成账号创建流程。",
    component: SignupPage,
  },

  // Core
  { id: "core-home", title: "首页（地图）", category: "Core", path: "home-page/index.html", description: "应用主屏幕，实时地图展示附近可用车辆与快捷操作。", component: HomePage },
  { id: "core-notification", title: "通知中心", category: "Core", path: "notification-page/index.html", description: "系统推送通知、订单状态更新与消息列表页面。", component: NotificationPage },
  { id: "core-search1", title: "搜索 1", category: "Core", path: "search1-page/index.html", description: "位置与目的地搜索界面，展示推荐结果列表。", component: Search1Page },
  { id: "core-search2", title: "搜索 2", category: "Core", path: "search2-page/index.html", description: "进阶搜索与筛选条件页面变体。", component: Search2Page },

  // Booking
  { id: "booking-choose-car", title: "选择车辆", category: "Booking", path: "choose-car-page/index.html", description: "浏览附近可选车辆，查看车型详情并挑选。", component: ChooseCarPage },
  { id: "booking-choose-trip1", title: "选择行程 1", category: "Booking", path: "choose-trip1-page/index.html", description: "推荐行程选项卡片，包含时间与价格信息。", component: ChooseTrip1Page },
  { id: "booking-choose-trip2", title: "选择行程 2", category: "Booking", path: "choose-trip2-page/index.html", description: "行程列表展示与对比页面变体。", component: ChooseTrip2Page },
  { id: "booking-confirm-godyx", title: "确认 GODYX", category: "Booking", path: "confirm-godyx-page/index.html", description: "确认启用 GODYX 高级服务的专属流程。", component: ConfirmGodyxPage },
  { id: "booking-confirm-pickup1", title: "确认上车点 1", category: "Booking", path: "confirm-pickup1-page/index.html", description: "确认乘车上车地点与司机信息匹配界面。", component: ConfirmPickup1Page },
  { id: "booking-confirm-pickup2", title: "确认上车点 2", category: "Booking", path: "confirm-pickup2-page/index.html", description: "确认上车流程的交互变体，用于不同场景测试。", component: ConfirmPickup2Page },
  { id: "booking-confirm-pickup3", title: "确认上车点 3", category: "Booking", path: "confirm-pickup3-page/index.html", description: "确认上车流程的交互变体，用于不同场景测试。", component: ConfirmPickup3Page },
  { id: "booking-confirm-pickup4", title: "确认上车点 4", category: "Booking", path: "confirm-pickup4-page/index.html", description: "确认上车流程的交互变体，用于不同场景测试。", component: ConfirmPickup4Page },
  { id: "booking-confirm-pickup5", title: "确认上车点 5", category: "Booking", path: "confirm-pickup5-page/index.html", description: "确认上车流程的交互变体，用于不同场景测试。", component: ConfirmPickup5Page },
  { id: "booking-confirm-pickup6", title: "确认上车点 6", category: "Booking", path: "confirm-pickup6-page/index.html", description: "确认上车流程的交互变体，用于不同场景测试。", component: ConfirmPickup6Page },
  { id: "booking-confirm-pickup7", title: "确认上车点 7", category: "Booking", path: "confirm-pickup7-page/index.html", description: "确认上车流程的交互变体，用于不同场景测试。", component: ConfirmPickup7Page },
  { id: "booking-requesting", title: "请求司机中", category: "Booking", path: "requesting-page/index.html", description: "叫车成功后等待司机接单的实时加载状态。", component: RequestingPage },
  { id: "booking-schedule", title: "预约行程", category: "Booking", path: "schedule-page/index.html", description: "使用日历提前预约未来行程的时间与地点。", component: SchedulePage },

  // Payment
  { id: "payment-select", title: "选择支付方式", category: "Payment", path: "payment-pages/select-payment.html", description: "支持微信、支付宝、银行卡等多种支付渠道选择。", component: SelectPaymentPage },
  { id: "payment-confirm", title: "确认支付", category: "Payment", path: "payment-pages/confirm-payment.html", description: "订单金额确认与支付完成流程界面。", component: ConfirmPaymentPage },

  // Trips
  { id: "trips-hub", title: "我的行程总览", category: "Trips", path: "trips-pages/index.html", description: "用户全部行程管理的主入口页面。", component: TripsIndexPage },
  { id: "trips-test", title: "行程测试页", category: "Trips", path: "trips-pages/test-trips.html", description: "开发测试用的行程功能集合与链接页。", component: TripTestPage },
  { id: "trips-detail-cancelled", title: "行程详情（已取消）", category: "Trips", path: "trips-pages/trips-detail-1.html", description: "展示已取消订单的详情、原因与相关操作。", component: TripDetailCancelledPage },
  { id: "trips-detail-completed", title: "行程详情（已完成）", category: "Trips", path: "trips-pages/trips-detail-2.html", description: "历史完成订单详情，包含费用与评价入口。", component: TripDetailCompletedPage },
  { id: "trips-detail-help", title: "行程详情（帮助）", category: "Trips", path: "trips-pages/trips-detail-3.html", description: "需要客服帮助的行程详情与问题上报页。", component: TripDetailHelpPage },
  { id: "trips-past", title: "历史行程", category: "Trips", path: "trips-pages/your-trips-past.html", description: "用户过去所有已完成行程的列表记录。", component: YourTripsPastPage },
  { id: "trips-upcoming", title: "进行中行程", category: "Trips", path: "trips-pages/your-trips-upcoming.html", description: "当前进行中与即将开始的行程卡片列表。", component: YourTripsUpcomingPage },
  { id: "trip-index", title: "行程模块入口", category: "Trips", path: "trip-pages/index.html", description: "行程相关子功能导航集合页面。", component: TripIndexPage },
  { id: "trip-pickup-countdown", title: "上车倒计时", category: "Trips", path: "trip-pages/pickup-countdown.html", description: "司机即将到达的实时倒计时与状态跟踪。", component: PickupCountdownPage },
  { id: "trip-scheduling", title: "行程调度中", category: "Trips", path: "trip-pages/scheduling-trip.html", description: "进行中的行程规划与安排详情页面。", component: SchedulingTripPage },
  { id: "trip-upcoming", title: "即将开始行程", category: "Trips", path: "trip-pages/upcoming-trip.html", description: "已确认的下一趟行程的卡片与详情视图。", component: UpcomingTripPage },

  // Account
  { id: "account-profile", title: "个人资料", category: "Account", path: "account-pages/profile.html", description: "用户头像、昵称与基本账户信息展示页。", component: ProfilePage },
  { id: "account-edit1", title: "编辑账户 1", category: "Account", path: "account-pages/edit-account-1.html", description: "账户信息编辑表单的第一种界面变体。", component: EditAccount1Page },
  { id: "account-edit2", title: "编辑账户 2", category: "Account", path: "account-pages/edit-account-2.html", description: "账户信息编辑表单的第二种界面变体。", component: EditAccount2Page },
  { id: "account-index", title: "账户模块入口", category: "Account", path: "account-pages/index.html", description: "账户设置与个人中心功能导航集合页。", component: AccountIndexPage },
  { id: "account-test", title: "账户测试页", category: "Account", path: "account-pages/test-pages.html", description: "账户页面功能测试与链接集合。", component: AccountTestPage },

  // Map
  { id: "map-index", title: "地图模块入口", category: "Map", path: "map-pages/index.html", description: "地图相关功能导航集合页面。", component: MapIndexPage },
  { id: "map-home", title: "地图主页", category: "Map", path: "map-pages/map-home.html", description: "核心地图浏览界面，支持定位与保存地点。", component: MapHomePage },
  { id: "map-route", title: "路线地图", category: "Map", path: "map-pages/route-map.html", description: "显示规划行驶路线的地图可视化页面。", component: RouteMapPage },
  { id: "map-help", title: "帮助地图", category: "Map", path: "map-pages/help-map.html", description: "地图使用帮助与功能指引叠加界面。", component: HelpMapPage },
  { id: "map-rental-cost", title: "租车费用", category: "Map", path: "map-pages/rental-cost.html", description: "根据距离、车型实时计算租车价格的工具页。", component: RentalCostPage },

  // Other
  { id: "other-evaluate1", title: "评价 1（打分）", category: "Other", path: "evaluate1-page/index.html", description: "订单完成后评分与文字反馈的第一版界面。", component: Evaluate1Page },
  { id: "other-evaluate2", title: "评价 2", category: "Other", path: "evaluate2-page/index.html", description: "评价与反馈流程的进阶交互变体。", component: Evaluate2Page },
];

// Safe accessor used by PlaceholderPage (prevents temporal dead zone / ordering issues)
export const getMigratedPages = () =>
  pageRegistry.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p) => p.component && (p.component as any).name !== 'PlaceholderPage' && p.component !== PlaceholderPage
  );

export const migratedCount = () => getMigratedPages().length;

// Clean helper for router + deep linking (used by App with useParams)
export const findPageById = (id: string): PageDefinition | undefined =>
  pageRegistry.find(p => p.id === id);

export default pageRegistry;
