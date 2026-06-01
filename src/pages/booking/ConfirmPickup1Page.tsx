import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ConfirmPickup1PageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPickup1Page: React.FC<ConfirmPickup1PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { info } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [addressOpacity, setAddressOpacity] = useState(1);

  const handleBack = () => {
    addRecentAction('Back from confirm pickup 1');
    onNavigate?.('booking-choose-trip1');
  };

  const handleSearch = () => {
    addRecentAction('Search location in pickup confirm');
    setAddressOpacity(0.5);
    setTimeout(() => {
      setAddressOpacity(1);
      info('位置搜索', '打开位置搜索（演示）');
    }, 180);
  };

  const handleConfirm = () => {
    addRecentAction('Confirmed pickup point');
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      // Drive real bookedTrips + activeTrip state on key confirm pickup location action (defensive)
      const tripId = activeTrip?.id;
      if (tripId) {
        updateTripStatus(tripId, activeTrip?.status || 'upcoming', {
          from: '51 Sharon St (confirmed pickup)',
          eta: activeTrip?.eta ? `${activeTrip.eta} • pickup locked` : 'Pickup confirmed'
        });
        addRecentAction('Confirmed pickup location — updated via updateTripStatus');
      } else {
        bookTrip({
          status: 'upcoming',
          from: '51 Sharon St (confirmed)',
          to: 'Apple Union Square',
          eta: '3:50 PM',
          price: 16
        });
        addRecentAction('Confirmed pickup location — seeded via bookTrip (no prior active)');
      }
      onNavigate?.('booking-confirm-pickup2');
    }, 1450);
  };

  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden' }}>
      {/* 地图背景 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 375, height: 629,
        background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        <div style={{ position: 'absolute', top: 100, left: 50, width: 280, height: 400, border: '2px solid #49493d', borderRadius: '50% 30% 40% 60%', opacity: 0.3 }} />
      </div>

      <StatusBar dark />

      {/* 返回 */}
      <div style={{ position: 'absolute', top: 40, left: 0, width: 375, height: 72, padding: '24px 335px 32px 24px', zIndex: 15 }}>
        <span style={{ width: 16, height: 16, cursor: 'pointer', fontSize: 16, color: '#fff' }} onClick={handleBack}>←</span>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: 375, height: 812, background: 'rgba(0,0,0,0.6)', zIndex: 5 }} />

      {/* 底部确认卡片 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: 375, height: 343,
        background: '#fff', borderRadius: '24px 24px 0 0',
        boxShadow: '0 4px 40px rgba(0,0,0,0.05)', zIndex: 20, paddingTop: 32
      }}>
        <p style={{ margin: '0 0 0 24px', fontSize: 20, fontWeight: 500, color: '#49493d' }}>Confirm your pick-up spot</p>

        <div style={{ marginTop: 16, marginLeft: 24, background: '#bdbdbd', width: 327, height: 1 }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 13, padding: '0 24px' }}>
          <p style={{ margin: '3px 0 0 0', fontSize: 16, fontWeight: 500, color: '#49493d', opacity: addressOpacity }}>51 Sharon St</p>
          <span style={{ width: 24, height: 24, cursor: 'pointer', fontSize: 18, color: '#49493d' }} onClick={handleSearch}>🔍</span>
        </div>

        <div
          onClick={handleConfirm}
          style={{
            display: 'flex', alignItems: 'center', margin: '24px 24px 0', borderRadius: 12,
            background: '#fecc2a', padding: '12px 106px', cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <p style={{ lineHeight: '20px', fontSize: 16, fontWeight: 500, color: '#49493d' }}>
            {confirming ? '确认中...' : 'Confirm pick-up'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 28, padding: '21px 121px 8px 120px' }}>
          <div style={{ borderRadius: 100, background: '#49493d', width: 134, height: 5 }} />
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default ConfirmPickup1Page;
