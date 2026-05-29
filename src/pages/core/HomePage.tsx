import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface HomePageProps {
  onNavigate?: (pageId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user, activeTrip, addRecentAction } = useDemoState();
  const { info } = useToast();
  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden' }}>
      <StatusBar />

      {/* 顶部用户栏 */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 16, padding: '0 24px' }}>
        <div className="avatar" style={{
          width: 50, height: 50, borderRadius: '50%',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, color: 'white', overflow: 'hidden'
        }}>{user.avatar}</div>
        <div style={{ marginLeft: 12, color: '#49493d', fontSize: 16, fontWeight: 500 }}>
          Good morning, {user.name.split(' ')[0]}
        </div>
        <div style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => { addRecentAction('Opened account from home'); onNavigate?.('account-index'); }}>☰</div>
      </div>

      {activeTrip && (
        <div onClick={() => { addRecentAction('Viewed active from home'); onNavigate?.('trips-upcoming'); }} style={{ margin: '8px 16px 0', padding: '8px 12px', background: '#fff8e1', border: '1px solid #fecc2a', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
          🚕 Active trip to <strong>{activeTrip.to}</strong> — tap to view
        </div>
      )}

      {/* 地图区域 */}
      <div style={{
        position: 'relative',
        marginTop: 24,
        height: 380,
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, #d0d0d0 1px, transparent 1px),
          radial-gradient(circle at 80% 70%, #d0d0d0 1px, transparent 1px),
          radial-gradient(circle at 40% 80%, #d0d0d0 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px, 30px 30px, 40px 40px'
      }}>
        {/* 地图上的车辆和地点标记 (简化视觉) */}
        <div style={{ position: 'absolute', top: '28%', left: '22%', fontSize: 22 }}>🚗</div>
        <div style={{ position: 'absolute', top: '41%', left: '61%', fontSize: 22 }}>🚙</div>
        <div style={{ position: 'absolute', top: '55%', left: '33%', fontSize: 20 }}>🟡</div>

        {/* 定位按钮 */}
        <div
          style={{
            position: 'absolute', top: 167, right: 24, width: 48, height: 48,
            borderRadius: '50%', background: '#fff', boxShadow: '0px 4px 40px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
          onClick={() => info('定位', '定位到当前位置 (demo)')}
        >
          🎯
        </div>
      </div>

      {/* 底部操作面板 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: 375, height: 417,
        background: '#ffffff', borderRadius: '24px 24px 0 0',
        paddingTop: 32, boxShadow: '0px -4px 20px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* 搜索框 */}
        <div style={{ margin: '0 24px', padding: '14px 16px', background: '#f3f3f3', borderRadius: 12, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
             onClick={() => { addRecentAction('Search from home'); onNavigate?.('core-search1'); }}>
          <span style={{ marginRight: 10 }}>🔍</span>
          <span style={{ color: '#6E6A61' }}>Where are you going?</span>
        </div>

        {/* 快捷目的地 */}
        <div style={{ margin: '20px 24px 0', display: 'flex', gap: 12 }}>
          {[
            { label: 'Apple Store', sub: 'Union Square', icon: '🍎' },
            { label: 'Starbucks', sub: 'Market St', icon: '☕' },
          ].map((d, i) => (
            <div key={i} style={{ flex: 1, padding: '12px 14px', background: '#f8f8f8', borderRadius: 12, cursor: 'pointer' }}
                 onClick={() => { addRecentAction('Choose car from home'); onNavigate?.('booking-choose-car'); }}>
              <div style={{ fontSize: 18 }}>{d.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{d.label}</div>
              <div style={{ fontSize: 11, color: '#959595' }}>{d.sub}</div>
            </div>
          ))}
        </div>

        {/* 车辆类型快速入口 */}
        <div style={{ margin: '24px 24px 0', fontSize: 13, fontWeight: 600, color: '#49493d' }}>Available now near you</div>

        <div style={{ display: 'flex', gap: 12, margin: '12px 24px 0' }}>
          {[
            { name: 'GodyX', price: '$22', time: '2 min' },
            { name: 'Black SUV', price: '$17', time: '4 min' },
          ].map((v, idx) => (
            <div key={idx} style={{ flex: 1, padding: 14, border: '1px solid #eee', borderRadius: 14, cursor: 'pointer' }}
                 onClick={() => { addRecentAction('Choose car from home'); onNavigate?.('booking-choose-car'); }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{idx === 0 ? '🚗' : '🚙'}</div>
              <div style={{ fontWeight: 600 }}>{v.name}</div>
              <div style={{ fontSize: 12, color: '#6E6A61' }}>{v.price} · {v.time}</div>
            </div>
          ))}
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default HomePage;
