import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ConfirmPickup3PageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPickup3Page: React.FC<ConfirmPickup3PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { info } = useToast();
  const handleBack = () => {
    addRecentAction('从确认上车点 3 返回');
    onNavigate?.('booking-confirm-pickup2');
  };

  const handleEdit = () => { addRecentAction('编辑上车点'); info('上车点', '编辑上车点 (demo)'); };
  const handleLocate = () => {
    addRecentAction('在确认上车页定位');
    // Mutate state on locate (confirm location action)
    if (activeTrip?.id) {
      updateTripStatus(activeTrip.id, activeTrip.status || 'upcoming', { eta: '定位中 · ETA 已更新' });
      addRecentAction('通过定位确认上车位置');
    }
    info('定位', '正在获取当前位置... (demo)');
  };
  const handleCall = () => {
    addRecentAction('从上车页呼叫司机');
    // Key driver call action: attach driver info + progress status (defensive if trip exists)
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, 'in-progress', { driver: 'Jack（丰田凯美瑞 9HTR789）', eta: '约 2 分钟' });
      addRecentAction('已呼叫司机 — 状态与司机信息已更新');
    } else {
      bookTrip({ status: 'in-progress', from: '旧金山国际机场', to: '苹果联合广场', driver: 'Jack', vehicle: '丰田凯美瑞', eta: '2 分钟' });
      addRecentAction('已呼叫司机 — 已创建行程');
    }
    info('电话', '正在拨打司机电话... (demo)');
  };
  const handleSun = () => info('模式', '切换日光模式 (demo)');

  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 375, height: 596, background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)' }} />

      <StatusBar dark />

      <div style={{ position: 'absolute', top: 40, left: 0, width: 375, height: 72, padding: '24px 335px 32px 24px', zIndex: 15 }}>
        <span style={{ width: 16, height: 16, cursor: 'pointer', fontSize: 16, color: '#49493d' }} onClick={handleBack}>☰</span>
      </div>

      {/* 黄色 pickup 提示卡 */}
      <div style={{
        position: 'absolute', top: 120, left: 24, width: 327, height: 68,
        background: '#fed16c', borderRadius: 12, padding: '16px 16px 12px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 20
      }}>
        <p style={{ width: 220, fontSize: 14, lineHeight: '20px', color: '#49493d' }}>请在旧金山国际机场上车点会合</p>
        <span style={{ marginTop: 8, width: 20, height: 20, cursor: 'pointer', fontSize: 16 }} onClick={handleEdit}>✏️</span>
      </div>

      {/* 定位按钮 */}
      <div style={{
        position: 'absolute', top: 209, right: 24, width: 48, height: 48,
        borderRadius: '50%', background: '#fff', padding: 14, cursor: 'pointer', zIndex: 20,
        boxShadow: '0 4px 40px rgba(0,0,0,0.05)'
      }} onClick={handleLocate}>
        <span style={{ fontSize: 16 }}>🎯</span>
      </div>

      {/* 底部信息卡 */}
      <div style={{
        position: 'absolute', top: 461, left: 0, width: 375, height: 351,
        background: '#fff', borderRadius: '24px 24px 0 0', zIndex: 25, paddingTop: 32
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px' }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>所有司机均经过审核</p>
            <p style={{ marginTop: 7, width: 213, fontSize: 12, color: '#959595' }}>所有司机在首次接单前及之后都会持续接受审核。</p>
          </div>
          <div style={{ position: 'relative', width: 60, height: 60, background: '#fecc2a', borderRadius: '50%' }}>
            <span style={{ position: 'absolute', top: 18, left: 18, fontSize: 18 }}>👤</span>
            <div style={{ position: 'absolute', top: 40, left: 40, background: '#fed16c', width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, color: '#49493d' }}>✓</span>
            </div>
          </div>
        </div>

        <div style={{ margin: '21px 0 0 24px', background: '#f3f3f3', width: 327, height: 1 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 23, padding: '0 29px 0 24px' }}>
          <div style={{ width: 120, height: 61, background: 'linear-gradient(45deg,#f0f0f0,#e0e0e0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🚗</div>
          <div style={{ marginTop: 21 }}>
            <p style={{ fontSize: 14, color: '#49493d' }}>丰田凯美瑞</p>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d', marginLeft: 19 }}>9HTR789</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 105px 0', minWidth: 165, height: 20 }}>
          <p style={{ fontSize: 14, color: '#49493d' }}>Jack · 4.93</p>
          <span style={{ color: '#fecc2a', fontSize: 10 }}>⭐</span>
          <p style={{ fontSize: 14, color: '#49493d' }}>- 3,375 次行程</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: '0 24px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleCall}>
            <span style={{ fontSize: 14 }}>📞</span>
          </div>
          <div style={{ borderRadius: 24, background: '#f3f3f3', padding: '14px 73px 14px 16px' }}>
            <p style={{ fontSize: 14, color: '#959595' }}>有上车备注吗？</p>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleSun}>
            <div style={{ background: '#fecc2a', width: 3, height: 2 }} />
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: 16, padding: '21px 121px 8px 120px' }}>
          <div style={{ borderRadius: 100, background: '#49493d', width: 134, height: 5 }} />
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default ConfirmPickup3Page;
