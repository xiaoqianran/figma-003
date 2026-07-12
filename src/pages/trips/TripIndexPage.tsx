import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripIndexPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction } = useDemoState();
  const items = [
    { id: 'trip-upcoming', title: 'Upcoming trip set', desc: '显示已安排的行程详情，包括目的地、时间、价格' },
    { id: 'trip-pickup-countdown', title: 'Pick up countdown', desc: '实时显示接机倒计时，包含地图与车辆位置' },
    { id: 'trip-scheduling', title: 'Scheduling your trip', desc: '行程安排加载页面，进度动画与状态更新' },
  ];

  return (
    <div className="mobile-frame" style={{ background: '#fff', overflowY: 'auto' }}>
      <StatusBar />

      <div style={{ padding: 20 }}>
        <h2 style={{ textAlign: 'center', color: '#49493d', marginBottom: 20 }}>行程页面</h2>

        {items.map((item, i) => (
          <div key={i} onClick={() => {
            addRecentAction(`Opened trip page: ${item.title}`);
            onNavigate?.(item.id);
          }} style={{
            background: '#f8f9fa', borderRadius: 16, padding: 18, marginBottom: 14,
            cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontWeight: 600, color: '#49493d', marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: '#959595' }}>{item.desc}</div>
            <div style={{ color: '#fecc2a', fontSize: 12, marginTop: 8 }}>Open →</div>
          </div>
        ))}

        {activeTrip && (
          <div style={{ marginTop: 16, padding: 10, background: '#fffde7', borderRadius: 8, fontSize: 12 }}>
            Current active: <strong>{activeTrip.to}</strong> — <span onClick={() => { addRecentAction('Jumped to active from trip index'); onNavigate?.('trip-upcoming'); }} style={{color:'#fecc2a', cursor:'pointer'}}>view details</span>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button onClick={() => { addRecentAction('Opened full trips hub'); onNavigate?.('trips-hub'); }} style={{ padding: '10px 22px', background: '#fecc2a', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
            Go to Full Trips Hub
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default TripIndexPage;
