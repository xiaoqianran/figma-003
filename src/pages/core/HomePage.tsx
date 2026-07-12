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
  const firstName = user.name.split(' ')[0] || user.name;

  // Entire layout designed to fit 375×812 with all CTAs fully visible (no clip by device frame)
  return (
    <div className="mobile-frame" data-testid="home-page" style={{ background: '#f7f6f3' }}>
      <StatusBar />

      <div style={{ display: 'flex', alignItems: 'center', padding: '2px 16px 0', flexShrink: 0 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: 'linear-gradient(145deg, #6b9dff, #8b7cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            color: 'white',
            boxShadow: '0 4px 14px rgba(107, 157, 255, 0.28)',
          }}
        >
          {user.avatar}
        </div>
        <div style={{ marginLeft: 10, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#9b9aa3', fontWeight: 500 }}>早上好</div>
          <div style={{ fontSize: 16, fontWeight: 650, color: '#111318', letterSpacing: '-0.02em' }}>{firstName}</div>
        </div>
        <button
          type="button"
          className="icon-btn"
          style={{ marginLeft: 'auto', background: '#fff', border: '1px solid #ebe9e4', borderRadius: 12, width: 36, height: 36 }}
          aria-label="打开账户"
          onClick={() => {
            addRecentAction('从首页打开账户');
            onNavigate?.('account-index');
          }}
        >
          ☰
        </button>
      </div>

      {activeTrip && (
        <div
          className="active-trip-banner"
          role="button"
          tabIndex={0}
          style={{ margin: '8px 16px 0', padding: '10px 12px' }}
          onClick={() => {
            addRecentAction('从首页查看进行中行程');
            onNavigate?.('trips-upcoming');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              addRecentAction('从首页查看进行中行程');
              onNavigate?.('trips-upcoming');
            }
          }}
        >
          🚕 进行中行程：前往 <strong>{activeTrip.to}</strong>
          <span style={{ opacity: 0.7 }}> · 点击查看</span>
        </div>
      )}

      {/* Flex map grows; bottom sheet fixed height so vehicles always fully visible */}
      <div
        className="map-mock"
        style={{
          position: 'relative',
          margin: '12px 16px 0',
          flex: '1 1 auto',
          minHeight: 160,
          maxHeight: 240,
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid #ebe9e4',
          boxShadow: '0 8px 28px rgba(17, 19, 24, 0.06)',
        }}
      >
        <div className="map-mock-grid" />
        <div style={{ position: 'absolute', top: '26%', left: '20%', fontSize: 22, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}>🚗</div>
        <div style={{ position: 'absolute', top: '48%', left: '58%', fontSize: 22, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}>🚙</div>
        <div style={{ position: 'absolute', top: '62%', left: '34%', width: 12, height: 12, borderRadius: '50%', background: '#ca8a04', boxShadow: '0 0 0 5px rgba(202,138,4,0.25)' }} />

        <button
          type="button"
          className="map-fab"
          style={{ position: 'absolute', top: 12, right: 12, width: 42, height: 42 }}
          aria-label="定位到当前位置"
          onClick={() => info('定位', '已定位到当前位置（演示）')}
        >
          ◎
        </button>
      </div>

      {/* Bottom panel — not absolute overflow; sits in flow so it never clips past 812 */}
      <div
        data-testid="home-bottom-panel"
        style={{
          flexShrink: 0,
          width: 375,
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 28px rgba(17, 19, 24, 0.08)',
          paddingTop: 16,
          display: 'flex',
          flexDirection: 'column',
          marginTop: 12,
        }}
      >
        <div
          className="search-pill"
          role="button"
          tabIndex={0}
          data-testid="home-search"
          style={{ margin: '0 16px', padding: '12px 14px' }}
          onClick={() => {
            addRecentAction('从首页进入搜索');
            onNavigate?.('core-search1');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              addRecentAction('从首页进入搜索');
              onNavigate?.('core-search1');
            }
          }}
        >
          <span className="icon">⌕</span>
          <span className="label">您要去哪里？</span>
        </div>

        <div style={{ margin: '12px 16px 0', display: 'flex', gap: 8 }}>
          {[
            { label: '苹果专卖店', sub: '联合广场', icon: '🍎' },
            { label: '星巴克', sub: '市场街', icon: '☕' },
          ].map((d) => (
            <div
              key={d.label}
              className="dest-chip"
              role="button"
              tabIndex={0}
              style={{ padding: '10px 12px' }}
              onClick={() => {
                addRecentAction('从首页选择车辆');
                onNavigate?.('booking-choose-car');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  addRecentAction('从首页选择车辆');
                  onNavigate?.('booking-choose-car');
                }
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 2 }}>{d.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 650, color: '#111318', letterSpacing: '-0.01em' }}>{d.label}</div>
              <div style={{ fontSize: 10, color: '#9b9aa3', marginTop: 1 }}>{d.sub}</div>
            </div>
          ))}
        </div>

        <div
          data-testid="home-available-label"
          style={{ margin: '12px 16px 0', fontSize: 12, fontWeight: 650, color: '#3a3942', letterSpacing: '-0.01em' }}
        >
          附近可用车辆
        </div>

        <div data-testid="home-vehicles" style={{ display: 'flex', gap: 8, margin: '8px 16px 0' }}>
          {[
            { name: 'GodyX', price: '¥22', time: '2 分钟', icon: '🚗' },
            { name: '黑金 SUV', price: '¥17', time: '4 分钟', icon: '🚙' },
          ].map((v) => (
            <div
              key={v.name}
              className="quick-vehicle"
              role="button"
              tabIndex={0}
              data-testid={`home-vehicle-${v.name}`}
              style={{ padding: '12px' }}
              onClick={() => {
                addRecentAction('从首页选择车辆');
                onNavigate?.('booking-choose-car');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  addRecentAction('从首页选择车辆');
                  onNavigate?.('booking-choose-car');
                }
              }}
            >
              <div className="icon" style={{ fontSize: 20, marginBottom: 2 }}>{v.icon}</div>
              <div className="name" style={{ fontSize: 13 }}>{v.name}</div>
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
