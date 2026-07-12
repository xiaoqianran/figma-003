import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ConfirmPickup4PageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPickup4Page: React.FC<ConfirmPickup4PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { info } = useToast();
  const handleBack = () => {
    addRecentAction('Back from pickup confirm 4');
    onNavigate?.('booking-confirm-pickup3');
  };
  const handleEdit = () => {
    addRecentAction('Edit pickup (page4)');
    if (activeTrip?.id) {
      updateTripStatus(activeTrip.id, activeTrip.status || 'upcoming', { from: 'Pickup point edited' });
      addRecentAction('Pickup edit (4) — via updateTripStatus');
    }
    info('上车点', '编辑上车点 (demo)');
  };
  const handleShare = () => {
    addRecentAction('Share live loc (page4)');
    if (activeTrip?.id) updateTripStatus(activeTrip.id, 'in-progress', { eta: 'Location shared' });
    info('分享', '分享实时位置给司机 (demo)');
  };
  const handleCall = () => {
    addRecentAction('Call driver (page4)');
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, 'in-progress', { driver: 'Push • Camry', eta: '前往中' });
      addRecentAction('Call (4) — driver via updateTripStatus');
    } else {
      bookTrip({ status: 'in-progress', from: 'SFO pickup', to: '苹果联合广场', driver: '推送', eta: '前往中' });
      addRecentAction('Call (4) — via bookTrip');
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

      {/* pickup card with divider */}
      <div style={{ position: 'relative', marginLeft: 24, width: 327, height: 68, zIndex: 20 }}>
        <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0, alignItems: 'flex-start', justifyContent: 'space-between', borderRadius: 12, background: '#fed16c', padding: '16px 16px 12px', width: 327, height: 68 }}>
          <p style={{ width: 199, fontSize: 14, lineHeight: '20px', color: '#49493d' }}>请在旧金山国际机场上车点会合</p>
          <span style={{ marginTop: 8, width: 20, height: 20, cursor: 'pointer', fontSize: 16 }} onClick={handleEdit}>✏️</span>
        </div>
        <div style={{ position: 'absolute', top: 34, left: 259, background: '#959595', width: 32, height: 1, transform: 'rotate(90deg)' }} />
      </div>

      {/* Help drivers card + location buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 138, padding: '0 24px', zIndex: 20 }}>
        <div style={{ padding: '12px 16px 32px', width: 271, background: 'rgba(255,255,255,0.95)', borderRadius: 8, boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
          <span style={{ marginTop: 4, fontSize: 32 }}>🚕</span>
          <div style={{ position: 'relative', width: 172, height: 40, marginLeft: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#49493d' }}>帮助司机更快找到您</p>
            <p style={{ position: 'absolute', bottom: -16, fontSize: 12, color: '#49493d' }}>上车时共享实时位置</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', padding: 12, marginBottom: 16, cursor: 'pointer', boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }} onClick={handleShare}><span style={{ fontSize: 14 }}>🎯</span></div>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', padding: 12, cursor: 'pointer', boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }} onClick={handleShare}><span style={{ fontSize: 14 }}>📡</span></div>
        </div>
      </div>

      {/* Bottom info card */}
      <div style={{ position: 'absolute', top: 509, left: 0, width: 375, height: 303, background: '#fff', borderRadius: '24px 24px 0 0', zIndex: 25, paddingTop: 32 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#49493d', paddingLeft: 24 }}>所有司机均经过审核</p>
        <div style={{ margin: '16px 0 0 24px', background: '#f3f3f3', width: 327, height: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 23, padding: '0 48px 0 0' }}>
          <div style={{ width: 120, height: 61, background: 'linear-gradient(45deg,#f0f0f0,#e0e0e0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginLeft: 24 }}>🚗</div>
          <div>
            <p style={{ fontSize: 14, color: '#49493d' }}>丰田凯美瑞</p>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d', marginLeft: 19 }}>9HTR789</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 105px 0', minWidth: 165 }}>
          <p style={{ fontSize: 14, color: '#49493d' }}>Push · 4.93</p>
          <span style={{ color: '#fecc2a', fontSize: 10, marginTop: 2 }}>⭐</span>
          <p style={{ fontSize: 14, color: '#49493d' }}>- 3,375 trips</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: '0 48px 0 0' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', marginLeft: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleCall}><span style={{ fontSize: 14 }}>📞</span></div>
          <div style={{ borderRadius: 24, background: '#f3f3f3', padding: '14px 73px 14px 16px' }}><p style={{ fontSize: 14, color: '#959595' }}>有上车备注吗？</p></div>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleSun}><div style={{ background: '#fecc2a', width: 3, height: 2 }} /></div>
        </div>

        <div style={{ display: 'flex', marginTop: 16, padding: '21px 121px 8px 120px' }}>
          <div style={{ borderRadius: 100, background: '#49493d', width: 134, height: 5 }} />
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default ConfirmPickup4Page;
