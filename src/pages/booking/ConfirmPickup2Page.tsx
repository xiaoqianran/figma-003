import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast as useToast_ } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ConfirmPickup2PageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPickup2Page: React.FC<ConfirmPickup2PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { info } = useToast_();
  const handleBack = () => {
    addRecentAction('Back from pickup confirm 2');
    onNavigate?.('booking-confirm-pickup1');
  };

  const handleSelect = (type: string) => {
    addRecentAction(`Selected pickup option: ${type}`);
    // Drive state on selection/confirm in pickup2
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, activeTrip.status || 'upcoming', { eta: type === 'ride-pack' ? 'Ride pack selected' : '$14 no-ride option' });
      addRecentAction(`Pickup2 selection — mutated via updateTripStatus (${type})`);
    } else if (type === 'ride-pack') {
      bookTrip({ status: 'upcoming', from: '51 Sharon St', to: 'Apple Union Square', eta: 'Ride pack', price: 13 });
      addRecentAction('Pickup2 ride-pack selected — via bookTrip');
    }
    if (type === 'ride-pack') {
      onNavigate?.('booking-confirm-pickup3');
    } else {
      info('选择', '已选择：不乘车，价格 $14 (demo)');
    }
  };

  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 375, height: 596,
        background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        <div style={{ position: 'absolute', top: 80, left: 40, width: 300, height: 420, border: '2px solid #49493d', borderRadius: '40% 60% 30% 70%', opacity: 0.3 }} />
      </div>

      <StatusBar dark />

      <div style={{ position: 'absolute', top: 40, left: 0, width: 375, height: 72, padding: '24px 335px 32px 24px', zIndex: 15 }}>
        <span style={{ width: 16, height: 16, cursor: 'pointer', fontSize: 16, color: '#fff' }} onClick={handleBack}>←</span>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, width: 375, height: 812, background: 'rgba(0,0,0,0.6)', zIndex: 5 }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: 375, height: 400,
        background: '#fff', borderRadius: '24px 24px 0 0',
        boxShadow: '0 4px 40px rgba(0,0,0,0.05)', zIndex: 20, paddingTop: 32
      }}>
        <div style={{ margin: '0 0 0 24px' }}>
          <p style={{ lineHeight: '32px', fontSize: 28, fontWeight: 700, color: '#49493d' }}>Get this trip for $13.00</p>
          <p style={{ margin: '12px 0 0 24px', fontSize: 14, color: '#959595' }}>Buy a ride pack and save on this trip</p>
        </div>

        <div
          onClick={() => handleSelect('no-ride')}
          style={{
            margin: '30px 24px 0', border: '1px solid #fecc2a', borderRadius: 12, background: '#fff',
            padding: '11px 109px 11px 108px', cursor: 'pointer'
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 500, color: '#fecc2a' }}>No ride for $14</p>
        </div>

        <div
          onClick={() => handleSelect('ride-pack')}
          style={{
            margin: '16px 24px 0', borderRadius: 12, background: '#fecc2a',
            padding: '12px 110px 12px 109px', cursor: 'pointer'
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>Get a ride pack</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 24, padding: '21px 121px 8px 120px' }}>
          <div style={{ borderRadius: 100, background: '#49493d', width: 134, height: 5 }} />
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default ConfirmPickup2Page;
