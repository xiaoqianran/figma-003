import React from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';

interface AccountIndexPageProps {
  onNavigate?: (pageId: string) => void;
}

const AccountIndexPage: React.FC<AccountIndexPageProps> = ({ onNavigate }) => {
  const {
    user, activeTrip, bookedTrips, addRecentAction,
    balance, hasGodyPass, promoCredits, giftsSent, eatsOrders,
    buyGodyPass, claimPromoCredit, sendGift, placeEatsOrder
  } = useDemoState();
  const { success, info } = useToast();

  const navItems = [
    { label: '个人资料', id: 'account-profile', icon: '👤' },
    { label: '编辑账户 #1', id: 'account-edit1', icon: '✏️' },
    { label: '编辑账户 #2（键盘）', id: 'account-edit2', icon: '⌨️' },
    { label: '测试页面', id: 'account-test', icon: '🧪' },
    { label: '首页', id: 'core-home', icon: '🏠' },
  ];

  return (
    <div className="mobile-frame">
      <StatusBar />

      <TopNav title="账户" onBack={() => { addRecentAction('从账户入口返回首页'); onNavigate?.('core-home'); }} />

      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#49493d', marginBottom: 8 }}>GODY 账户</h2>
        <div style={{ fontSize: 13, color: '#49493d', marginBottom: 4 }}>已登录：<strong>{user.name}</strong></div>
        {activeTrip && <div style={{ fontSize: 12, color: '#fecc2a', marginBottom: 4 }}>进行中行程：{activeTrip.to}</div>}
        {bookedTrips.length > 0 && <div style={{ fontSize: 11, color: '#959595', marginBottom: 16 }}>已预订行程：{bookedTrips.length}（完整生命周期见测试页或行程中心）</div>}
        <p style={{ color: '#959595', fontSize: 13, marginBottom: 24 }}>管理您的资料与设置</p>

        {/* Demo feature status + quick actions (now functional via DemoState) */}
        <div style={{ background: '#fffdf5', border: '1px solid #f3e8c8', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#49493d', marginBottom: 8 }}>演示权益与功能</div>
          <div style={{ fontSize: 12, color: '#49493d', marginBottom: 10, lineHeight: 1.4 }}>
            余额：<strong>¥{balance.toFixed(2)}</strong> · Gody 通行证：{hasGodyPass ? '🎫 已激活' : '未激活'} · 优惠：🆓{promoCredits} · 礼品：🎁{giftsSent} · 外卖：🍽️{eatsOrders}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button onClick={() => { buyGodyPass(99); success('Gody 通行证', '从账户入口快速购买'); }} style={{ fontSize: 11, padding: '5px 10px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 6, cursor: 'pointer' }}>购买通行证 ¥99</button>
            <button onClick={() => { claimPromoCredit(1); success('免费行程', '已领取 +1 次优惠'); }} style={{ fontSize: 11, padding: '5px 10px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 6, cursor: 'pointer' }}>领取优惠</button>
            <button onClick={() => { sendGift('快速演示', 30); success('礼品', '已发送 ¥30 演示礼品'); }} style={{ fontSize: 11, padding: '5px 10px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 6, cursor: 'pointer' }}>发送 ¥30 礼品</button>
            <button onClick={() => { placeEatsOrder('演示小炒', '午间特惠', 25); info('外卖', '快捷下单成功'); }} style={{ fontSize: 11, padding: '5px 10px', background: '#0A0908', color: '#fecc2a', border: 'none', borderRadius: 6, cursor: 'pointer' }}>快捷外卖下单</button>
          </div>
          <div style={{ fontSize: 10, color: '#959595', marginTop: 6 }}>操作会更新共享 DemoState（个人资料页同步可见）</div>
        </div>

        {navItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              addRecentAction(`从账户首页进入 ${item.label}`);
              onNavigate?.(item.id);
            }}
            style={{
              background: '#f8f9fa',
              borderRadius: 12,
              padding: '16px 20px',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              border: '2px solid transparent'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fecc2a'; e.currentTarget.style.background = '#fffdf5'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#f8f9fa'; }}
          >
            <span style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</span>
            <span style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>{item.label}</span>
            <span style={{ marginLeft: 'auto', color: '#959595' }}>→</span>
          </div>
        ))}
      </div>

      <HomeIndicator />
    </div>
  );
};

export default AccountIndexPage;
