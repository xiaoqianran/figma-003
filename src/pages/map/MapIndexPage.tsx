import React from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';

interface MapIndexPageProps {
  onNavigate?: (pageId: string) => void;
}

const MapIndexPage: React.FC<MapIndexPageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction } = useDemoState();
  const pages = [
    { id: 'map-home', title: 'Map Home', desc: '用户头像、搜索、地图与操作按钮', icon: '🗺️' },
    { id: 'map-route', title: 'Route Map', desc: '路线路径 + GodyX卡片', icon: '🛤️' },
    { id: 'map-help', title: 'Help Map', desc: '帮助按钮与缩放/定位控制', icon: '❓' },
    { id: 'map-rental-cost', title: 'Rental Cost', desc: '费用明细 + 支付选择', icon: '💰' },
  ];

  return (
    <div className="mobile-frame">
      <StatusBar />
      <TopNav title="Map Pages" onBack={() => { addRecentAction('Back from map index'); onNavigate?.('core-home'); }} />

      <div style={{ padding: 20 }}>
        {activeTrip && <div style={{ fontSize: 12, marginBottom: 12, padding: 8, background: '#fff8e1', borderRadius: 6 }}>Active trip overlay: {activeTrip.to}</div>}
        {pages.map((p, i) => (
          <div key={i} onClick={() => { addRecentAction(`Opened map page: ${p.title}`); onNavigate?.(p.id); }} style={{
            background: '#fff', padding: '18px 20px', borderRadius: 14, marginBottom: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center'
          }}>
            <div style={{ fontSize: 26, marginRight: 16 }}>{p.icon}</div>
            <div>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#959595' }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <HomeIndicator />
    </div>
  );
};

export default MapIndexPage;
