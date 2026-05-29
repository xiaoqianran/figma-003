import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface HelpMapPageProps {
  onNavigate?: (pageId: string) => void;
}

const HelpMapPage: React.FC<HelpMapPageProps> = ({ onNavigate }) => {
  const { info } = useToast();
  const { activeTrip, addRecentAction } = useDemoState();
  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 22, cursor: 'pointer' }} onClick={() => { addRecentAction('Back from help map'); onNavigate?.('map-home'); }}>←</span>
        <div style={{ background: '#fff', padding: '8px 24px', borderRadius: 12, boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }} onClick={() => addRecentAction('Tapped help header')}>Help</div>
      </div>
      {activeTrip && <div style={{ textAlign: 'center', fontSize: 11, paddingBottom: 4 }}>Live: trip to {activeTrip.to}</div>}

      <div style={{ height: 660, background: 'linear-gradient(135deg,#e8f4f8 0%,#d4edda 50%,#fff3cd 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 305, right: 57, width: 10, height: 10, background: '#fecc2a', borderRadius: '50%' }} />

        <div style={{ position: 'absolute', top: 280, right: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div onClick={() => { addRecentAction('Zoom on help map'); info('地图', '地图缩放 (demo)'); }} style={{ background: '#fff', padding: 22, borderRadius: '50%', boxShadow: '0 4px 40px rgba(0,0,0,0.1)', cursor: 'pointer' }}>🔍</div>
          <div onClick={() => { addRecentAction('Locate on help map'); info('定位', '已定位 (demo)'); }} style={{ background: '#fff', padding: 14, borderRadius: '50%', boxShadow: '0 4px 40px rgba(0,0,0,0.1)', cursor: 'pointer' }}>🎯</div>
          <div onClick={() => { addRecentAction('Confirmed on help map'); onNavigate?.('map-route'); }} style={{ background: '#fff', padding: 14, borderRadius: '50%', boxShadow: '0 4px 40px rgba(0,0,0,0.1)', cursor: 'pointer' }}>✅</div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default HelpMapPage;
