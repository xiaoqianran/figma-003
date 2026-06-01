import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { Modal } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ConfirmPickup7PageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPickup7Page: React.FC<ConfirmPickup7PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { success } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleBack = () => { addRecentAction('Back from confirm pickup 7'); onNavigate?.('booking-confirm-pickup6'); };
  const handleShare = () => { addRecentAction('Shared trip status from pickup 7'); };
  const handleCall = () => {
    addRecentAction('Called driver from pickup 7');
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, 'in-progress', { driver: 'Push Puttichai • Toyota Camry', eta: '4:08pm arrival' });
      addRecentAction('Driver call (page7) — driver/ETA via updateTripStatus');
    } else {
      bookTrip({ status: 'in-progress', from: 'Pickup 7', to: 'Apple Union Square', driver: 'Push', vehicle: 'Toyota Camry', eta: '4:08pm' });
      addRecentAction('Driver call (page7) — via bookTrip');
    }
    // No toast — use live state + inspector instead
  };
  const handleCancel = () => { addRecentAction('Opened cancel from pickup 7'); setShowCancelModal(true); };
  const handleSafety = () => {
    addRecentAction('Opened safety from pickup 7');
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, activeTrip.status || 'in-progress', { eta: 'Safety confirmed • 4:08pm' });
      addRecentAction('Safety confirmed (page7) — via updateTripStatus');
    } else {
      bookTrip({ status: 'in-progress', from: 'Pickup 7 loc', to: 'Apple Union Square', eta: 'Safety confirmed' });
      addRecentAction('Safety confirmed (page7) — via bookTrip');
    }
    // No toast for secondary actions
  };
  const handleLearn = () => { addRecentAction('Learned about top driver from pickup 7'); };
  const handleSave = () => { addRecentAction('Saved location from pickup 7'); success('已保存', '已添加到我的保存地点'); };
  const handleTrusted = () => { addRecentAction('Set trusted contact from pickup 7'); };

  const confirmCancel = () => {
    addRecentAction('Confirmed cancel from pickup 7');
    setShowCancelModal(false);
    success('行程已取消', '返回首页');
    onNavigate?.('core-home');
  };

  return (
    <div className="mobile-frame" style={{ height: 1003, overflow: 'hidden' }}>
      <StatusBar />

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 190px 32px 24px' }}>
        <span style={{ width: 16, height: 16, cursor: 'pointer', fontSize: 16, color: '#49493d' }} onClick={handleBack}>↑</span>
        <p style={{ fontSize: 20, fontWeight: 500, color: '#49493d' }}>4:08pm arrival</p>
      </div>

      <div style={{ padding: '8px 21px 19px 24px', cursor: 'pointer' }} onClick={handleShare}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: 158 }}>
            <span style={{ fontSize: 14, marginRight: 8 }}>📍</span>
            <p style={{ fontSize: 16, color: '#49493d' }}>Share trips status</p>
          </div>
          <p style={{ fontSize: 12, color: '#fecc2a', marginTop: 7 }}>Share</p>
        </div>
        <div style={{ marginTop: 11, marginLeft: 3, background: '#f3f3f3', width: 327, height: 1 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, padding: '0 24px' }}>
        <div style={{ borderRadius: 12, background: '#f3f3f3', padding: '13px 53px 15px', cursor: 'pointer' }} onClick={handleCancel}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>Cancel</p>
        </div>
        <div style={{ borderRadius: 12, background: '#fecc2a', padding: '14px 56px 14px 54px', cursor: 'pointer' }} onClick={handleSafety}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>Safety</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 40, padding: '0 24px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(45deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>👩‍💼</div>
        <div style={{ marginLeft: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>Push Puttichai</p>
          <p style={{ fontSize: 12, color: '#49493d' }}>Toyota Camry - 9HTR789</p>
        </div>
        <div style={{ marginLeft: 85, width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleCall}><span style={{ fontSize: 14 }}>📞</span></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, padding: '0 24px' }}>
        {[0,1].map(i => (
          <div key={i} style={{ width: 150, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>Top Driver</p>
            <p style={{ marginTop: 12, width: 248, fontSize: 14, color: '#49493d', lineHeight: '20px' }}>Save up to 15% on all routes when you ride with Gody and Pool in the San Francisco metropolitan area. Discounts may vary by trip.</p>
            <p style={{ marginTop: 12, fontSize: 12, color: '#fecc2a', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleLearn}>{i === 0 ? 'Learn more' : 'See profile'}</p>
          </div>
        ))}
      </div>

      <p style={{ margin: '16px 0 0 24px', fontSize: 12, color: '#959595' }}>Save this destination</p>
      <p style={{ margin: '12px 0 0 24px', fontSize: 20, fontWeight: 500, color: '#49493d' }}>Apple Union Square</p>
      <p style={{ margin: '8px 0 0 24px', fontSize: 12, color: '#959595', fontWeight: 500 }}>300 Pos St, San Francisco</p>
      <p style={{ margin: '12px 0 0 24px', fontSize: 12, color: '#fecc2a', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleSave}>Add to my Saved Places</p>

      <div style={{ margin: '24px 24px 0', background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
        <p style={{ fontSize: 12, color: '#959595' }}>Trusted contacts</p>
        <p style={{ marginTop: 8, fontSize: 20, fontWeight: 500, color: '#49493d' }}>Apple Union Square</p>
        <p style={{ marginTop: 16, width: 295, fontSize: 14, color: '#49493d', lineHeight: '20px' }}>Save up to 15% on all routes when you ride with Gody and Pool in the San Francisco metropolitan area. Discounts may vary by trip.</p>
        <div style={{ marginTop: 12, background: '#f3f3f3', width: 295, height: 1 }} />
        <p style={{ marginTop: 11, fontSize: 14, color: '#49493d', cursor: 'pointer' }} onClick={handleTrusted}>Set up trusted contacts</p>
      </div>

      <p style={{ margin: '16px 0 0 24px', fontSize: 12, color: '#959595' }}>Visa local offers for Sep 18 - 25</p>
      <p style={{ margin: '8px 0 0 24px', width: 327, fontSize: 20, fontWeight: 500, color: '#49493d' }}>Get Gody cash by using your Visa card around town</p>

      <div style={{ display: 'flex', marginTop: 24, padding: '21px 121px 8px 120px' }}>
        <div style={{ borderRadius: 100, background: '#49493d', width: 134, height: 5 }} />
      </div>

      <HomeIndicator />

      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="取消行程"
        destructive
        confirmText="确认取消"
        onConfirm={confirmCancel}
      >
        <p style={{ margin: 0, fontSize: 14, color: '#C9C6BE' }}>确定要取消当前行程吗？</p>
      </Modal>
    </div>
  );
};

export default ConfirmPickup7Page;
