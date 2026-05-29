import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';

interface UpcomingTripPageProps {
  onNavigate?: (pageId: string) => void;
}

const UpcomingTripPage: React.FC<UpcomingTripPageProps> = ({ onNavigate }) => {
  const { activeTrip, setActiveTrip, addRecentAction } = useDemoState();
  const { success, info } = useToast();

  const trip = activeTrip || {
    to: 'Apple Union Square',
    from: '51 Sharon St',
    eta: '3:50 PM',
    price: 16,
    vehicle: 'GodyX',
  };

  const handleFinish = () => {
    // Simulate processing then complete + update demo state
    const btn = document.activeElement as HTMLButtonElement | null;
    if (btn) {
      btn.style.transform = 'scale(0.95)';
      btn.textContent = 'Processing...';
    }

    setTimeout(() => {
      if (btn) {
        btn.style.transform = 'scale(1)';
        btn.textContent = 'Completed!';
        btn.style.background = '#00b894';
        btn.style.color = '#fff';
      }
      setTimeout(() => {
        addRecentAction(`Completed trip to ${trip.to}`);
        // Mark trip completed in state (or clear)
        if (activeTrip) {
          setActiveTrip({ ...activeTrip, status: 'completed' });
        }
        success('行程完成', '行程设置完成！ (demo state updated)');
        onNavigate?.('trips-upcoming');
      }, 800);
    }, 1200);
  };

  const showTerms = () => {
    info('条款', '显示服务条款详情 (demo)');
  };

  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden', background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), #333' }}>
      <StatusBar dark />

      {/* 背景装饰地图简化 */}
      <div style={{
        position: 'absolute', top: 40, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        backgroundImage: 'radial-gradient(circle at 30% 40%, #444 1px, transparent 1px), radial-gradient(circle at 70% 60%, #555 1px, transparent 1px)',
        backgroundSize: '40px 40px, 60px 60px'
      }} />

      {/* 底部弹窗卡片 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: '#fff', borderRadius: '20px 20px 0 0',
        padding: '24px 24px 0', boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        zIndex: 10
      }}>
        {/* 拖拽指示器 */}
        <div style={{ width: 40, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 20px' }} />

        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#49493d', marginBottom: 24, textAlign: 'center' }}>
          Upcoming trip set
        </h1>

        {/* 行程信息 - populated from DemoState when available */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#49493d', marginBottom: 12 }}>
            To {trip.to}
          </div>
          <div style={{ fontSize: 16, color: '#49493d', lineHeight: 1.6, marginBottom: 8 }}>
            {trip.eta || 'Tue, 24 Sep at 3:50 PM'} {trip.vehicle ? `· ${trip.vehicle}` : ''}
          </div>
          <div style={{ fontSize: 16, color: '#49493d', marginBottom: 16 }}>From: {trip.from || 'Current location'}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#49493d', marginBottom: 16 }}>${trip.price || 16}.00</div>
        </div>

        {/* 折扣提示 */}
        <div style={{ fontSize: 14, color: '#959595', lineHeight: 1.5, marginBottom: 8 }}>
          Save up to 15% on all routes when you ride with Gody and Pool in the San Francisco metropolitan area. Discounts may vary by trip.
          <span
            onClick={showTerms}
            style={{ color: '#fecc2a', textDecoration: 'underline', cursor: 'pointer', marginLeft: 4 }}
          >
            See terms
          </span>
        </div>

        {/* 完成按钮 */}
        <button
          onClick={handleFinish}
          className="primary-btn"
          style={{
            width: '100%', height: 52, background: '#fecc2a', border: 'none', borderRadius: 12,
            fontSize: 18, fontWeight: 600, color: '#49493d', cursor: 'pointer', marginTop: 24, marginBottom: 8
          }}
        >
          Finished
        </button>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default UpcomingTripPage;
