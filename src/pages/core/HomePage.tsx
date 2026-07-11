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
          fontSize: 20, color: 'white', overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>{user.avatar}</div>
        <div style={{ marginLeft: 12, color: '#49493d', fontSize: 16, fontWeight: 500 }}>
          Good morning, {user.name.split(' ')[0]}
        </div>
        <button
          type="button"
          className="icon-btn"
          style={{ marginLeft: 'auto' }}
          aria-label="Open account"
          onClick={() => { addRecentAction('Opened account from home'); onNavigate?.('account-index'); }}
        >
          ☰
        </button>
      </div>

      {activeTrip && (
        <div
          className="active-trip-banner"
          role="button"
          tabIndex={0}
          onClick={() => { addRecentAction('Viewed active from home'); onNavigate?.('trips-upcoming'); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              addRecentAction('Viewed active from home');
              onNavigate?.('trips-upcoming');
            }
          }}
        >
          🚕 Active trip to <strong>{activeTrip.to}</strong> — tap to view
        </div>
      )}

      {/* 地图区域 */}
      <div
        className="map-mock"
        style={{
          position: 'relative',
          marginTop: 24,
          height: 380,
          background: 'linear-gradient(145deg, #eef2ee 0%, #e4ebe4 45%, #dfe8e0 100%)',
        }}
      >
        <div className="map-mock-grid" style={{ opacity: 0.7 }} />
        {/* 地图上的车辆和地点标记 */}
        <div style={{ position: 'absolute', top: '28%', left: '22%', fontSize: 22, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.12))' }}>🚗</div>
        <div style={{ position: 'absolute', top: '41%', left: '61%', fontSize: 22, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.12))' }}>🚙</div>
        <div style={{ position: 'absolute', top: '55%', left: '33%', fontSize: 20, filter: 'drop-shadow(0 2px 4px rgba(254,204,42,0.4))' }}>🟡</div>

        {/* 定位按钮 */}
        <button
          type="button"
          className="map-fab"
          style={{ position: 'absolute', top: 167, right: 24 }}
          aria-label="Locate me"
          onClick={() => info('定位', '定位到当前位置 (demo)')}
        >
          🎯
        </button>
      </div>

      {/* 底部操作面板 */}
      <div
        className="bottom-sheet"
        style={{
          position: 'absolute', bottom: 0, left: 0, width: 375, height: 417,
          paddingTop: 28,
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* 搜索框 */}
        <div
          className="search-pill"
          role="button"
          tabIndex={0}
          onClick={() => { addRecentAction('Search from home'); onNavigate?.('core-search1'); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              addRecentAction('Search from home');
              onNavigate?.('core-search1');
            }
          }}
        >
          <span className="icon">🔍</span>
          <span className="label">Where are you going?</span>
        </div>

        {/* 快捷目的地 */}
        <div style={{ margin: '20px 24px 0', display: 'flex', gap: 12 }}>
          {[
            { label: 'Apple Store', sub: 'Union Square', icon: '🍎' },
            { label: 'Starbucks', sub: 'Market St', icon: '☕' },
          ].map((d, i) => (
            <div
              key={i}
              className="dest-chip"
              role="button"
              tabIndex={0}
              onClick={() => { addRecentAction('Choose car from home'); onNavigate?.('booking-choose-car'); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  addRecentAction('Choose car from home');
                  onNavigate?.('booking-choose-car');
                }
              }}
            >
              <div style={{ fontSize: 18 }}>{d.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4, color: '#0A0908' }}>{d.label}</div>
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
            <div
              key={idx}
              className="quick-vehicle"
              role="button"
              tabIndex={0}
              onClick={() => { addRecentAction('Choose car from home'); onNavigate?.('booking-choose-car'); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  addRecentAction('Choose car from home');
                  onNavigate?.('booking-choose-car');
                }
              }}
            >
              <div className="icon">{idx === 0 ? '🚗' : '🚙'}</div>
              <div className="name">{v.name}</div>
              <div className="meta">{v.price} · {v.time}</div>
            </div>
          ))}
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default HomePage;
