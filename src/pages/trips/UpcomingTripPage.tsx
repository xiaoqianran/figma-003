import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState, type DemoTrip } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';

interface UpcomingTripPageProps {
  onNavigate?: (pageId: string) => void;
}

const UpcomingTripPage: React.FC<UpcomingTripPageProps> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, setActiveTrip, addRecentAction, completeTrip, cancelTrip } = useDemoState();
  const { success, info } = useToast();

  // Support multiple booked trips: derive current + others for switching in this detail view
  const upcomingFromBooked = bookedTrips.filter(t => t.status === 'upcoming' || t.status === 'in-progress');
  const fallbackTrip: DemoTrip = {
    id: 'fallback-static',
    status: 'upcoming',
    to: '苹果联合广场',
    from: '莎伦街 51 号',
    eta: '3:50 PM',
    price: 16,
    vehicle: 'GodyX',
  };
  const currentTrip: DemoTrip = activeTrip || fallbackTrip;
  const otherUpcoming = upcomingFromBooked.filter(t => !activeTrip || t.id !== activeTrip.id);

  const trip = currentTrip; // for minimal diff in render

  const handleFinish = () => {
    // Use the new completeTrip mutation API for proper status + paid update
    const btn = document.activeElement as HTMLButtonElement | null;
    if (btn) {
      btn.style.transform = 'scale(0.95)';
      btn.textContent = '处理中...';
    }

    setTimeout(() => {
      if (btn) {
        btn.style.transform = 'scale(1)';
        btn.textContent = '已完成！';
        btn.style.background = '#00b894';
        btn.style.color = '#fff';
      }
      setTimeout(() => {
        addRecentAction(`已通过 completeTrip 完成前往 ${trip.to} 的行程`);
        if (currentTrip.id && currentTrip.id !== 'fallback-static') {
          completeTrip(currentTrip.id);
        } else if (activeTrip) {
          // fallback path
          setActiveTrip({ ...activeTrip, status: 'completed', paid: true, eta: '已到达' });
        }
        success('行程完成', '行程已完成并记录到历史（演示状态，通过 completeTrip）');
        // After complete, navigate to Past lists so it appears there
        onNavigate?.('trips-past');
      }, 800);
    }, 1200);
  };

  const handleCancel = () => {
    // Use cancelTrip mutation API (marks terminal)
    const id = currentTrip.id;
    addRecentAction(`已通过 cancelTrip 取消前往 ${trip.to} 的即将开始行程`);
    if (id && id !== 'fallback-static') {
      cancelTrip(id);
    } else if (activeTrip) {
      setActiveTrip({ ...activeTrip, status: 'completed' });
    }
    success('已取消', '行程已取消（将出现在历史列表中）');
    onNavigate?.('trips-past');
  };

  const switchToTrip = (t: DemoTrip) => {
    setActiveTrip(t);
    addRecentAction(`在即将开始详情中切换到行程 ${t.to}`);
    info('切换', '已聚焦到该行程');
  };

  const showTerms = () => {
    info('条款', '显示服务条款详情 （演示）');
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
          即将开始行程已设置
        </h1>

        {/* 行程信息 - populated from DemoState when available */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#49493d', marginBottom: 12 }}>
            前往 {trip.to}
          </div>
          <div style={{ fontSize: 16, color: '#49493d', lineHeight: 1.6, marginBottom: 8 }}>
            {trip.eta || '9 月 24 日 周二 下午 3:50'} {trip.vehicle ? `· ${trip.vehicle}` : ''}
          </div>
          <div style={{ fontSize: 16, color: '#49493d', marginBottom: 16 }}>出发：{trip.from || '当前位置'}</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#49493d', marginBottom: 16 }}>${trip.price || 16}.00</div>
        </div>

        {/* 折扣提示 */}
        <div style={{ fontSize: 14, color: '#959595', lineHeight: 1.5, marginBottom: 8 }}>
          在旧金山都市区与 Gody 拼车出行时，所有路线最高可省 15%。折扣可能因行程而异。
          <span
            onClick={showTerms}
            style={{ color: '#fecc2a', textDecoration: 'underline', cursor: 'pointer', marginLeft: 4 }}
          >
            查看条款
          </span>
        </div>

        {/* Multiple trips support: quick switcher if other upcoming exist (minimal addition) */}
        {otherUpcoming.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#959595', marginBottom: 4 }}>其他即将开始（{otherUpcoming.length}）：</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {otherUpcoming.slice(0, 3).map((t, i) => (
                <button key={i} onClick={() => switchToTrip(t)} style={{ fontSize: 11, padding: '4px 10px', background: '#f0f0f0', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  {t.to} ({t.status})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 完成按钮 - now uses completeTrip mutation, navs to past */}
        <button
          onClick={handleFinish}
          className="primary-btn"
          style={{
            width: '100%', height: 52, background: '#fecc2a', border: 'none', borderRadius: 12,
            fontSize: 18, fontWeight: 600, color: '#49493d', cursor: 'pointer', marginTop: 8, marginBottom: 8
          }}
        >
          已完成
        </button>

        {/* New functional Cancel button using cancelTrip API */}
        <button
          onClick={handleCancel}
          style={{
            width: '100%', height: 44, background: '#fff', border: '1px solid #ccc', borderRadius: 12,
            fontSize: 16, fontWeight: 500, color: '#c62828', cursor: 'pointer', marginBottom: 16
          }}
        >
          取消此行程
        </button>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default UpcomingTripPage;
