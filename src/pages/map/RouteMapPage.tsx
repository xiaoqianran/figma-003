import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface RouteMapPageProps {
  onNavigate?: (pageId: string) => void;
}

const RouteMapPage: React.FC<RouteMapPageProps> = ({ onNavigate }) => {
  const { info, success } = useToast();
  const { activeTrip, addRecentAction } = useDemoState();
  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 22, cursor: 'pointer' }} onClick={() => { addRecentAction('从路线地图返回'); onNavigate?.('map-home'); }}>←</span>
        <div style={{ background: '#fff', padding: '8px 26px', borderRadius: 12, boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }} onClick={() => { addRecentAction('路线地图帮助'); }}>帮助</div>
      </div>
      {activeTrip && <div style={{ padding: '4px 24px', fontSize: 11, color: '#6E6A61' }}>实时行程：{activeTrip.from} → {activeTrip.to}</div>}

      <div style={{ height: 660, background: 'linear-gradient(135deg,#e8f4f8 0%,#d4edda 50%,#fff3cd 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 255, left: 30, width: 268, height: 246, background: 'linear-gradient(45deg,transparent,#fecc2a,transparent)', opacity: 0.75, borderRadius: '50%' }} />
        
        {Array.from({length:6}).map((_,i) => (
          <div key={i} style={{ position: 'absolute', fontSize: 15, top: 150 + (i*38), left: 40 + (i*35) + (i%2 ? 60 : 0), transform: `rotate(${i*20-40}deg)` }} onClick={() => { addRecentAction('在路线地图选择车辆'); info('车辆', '车辆已选 （演示）'); }}>🚕</div>
        ))}

        <div style={{ position: 'absolute', top: 340, left: 69, fontSize: 24 }} onClick={() => { addRecentAction('在路线上选择目的地'); success('目的地', '目的地已选 （演示）'); }}>📍</div>

        <div onClick={() => { addRecentAction('从路线地图选车'); onNavigate?.('booking-choose-car'); }} style={{ position: 'absolute', top: 154, left: 76, background: '#fecc2a', borderRadius: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', width: 110, cursor: 'pointer' }}>
          <div style={{ background: '#fff', padding: '4px 14px', borderRadius: '12px 0 0 12px' }}>🚗 GodyX</div>
          <div style={{ fontSize: 12, paddingLeft: 8, lineHeight: 1 }}>10<br/>分钟</div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default RouteMapPage;
