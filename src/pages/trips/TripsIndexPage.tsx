import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripsIndexPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction } = useDemoState();
  const cards = [
    { id: 'trips-upcoming', title: 'Your trips - Upcoming', desc: '即将到来的行程页面，展示用户暂无即将到来的行程的空状态。', label: 'Upcoming' },
    { id: 'trips-past', title: 'Your trips - Past', desc: '历史行程页面，展示用户过去完成的行程记录。', label: 'Past' },
    { id: 'trips-detail-cancelled', title: 'Trips detail #1 (Cancelled)', desc: '取消行程详情页面，展示被取消的行程信息。', label: 'Cancelled' },
    { id: 'trips-detail-completed', title: 'Trips detail #2 (Completed)', desc: '完成行程详情页面，包含完整信息与评价入口。', label: 'Completed' },
    { id: 'trips-detail-help', title: 'Trips detail #3 (Help)', desc: '帮助和支持页面，包含多种帮助选项与问题分类。', label: 'Help' },
  ];

  return (
    <div className="mobile-frame" style={{ background: '#fff', overflowY: 'auto' }}>
      <StatusBar />

      <div style={{ padding: '16px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 16, color: '#49493d' }}>🚗 My Trips Hub</h2>

        {cards.map((c, idx) => (
          <div
            key={idx}
            onClick={() => {
              addRecentAction(`Opened trips hub card: ${c.label}`);
              onNavigate?.(c.id);
            }}
            style={{
              background: '#fff', borderRadius: 16, marginBottom: 16, padding: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', cursor: 'pointer',
              border: '1px solid #f0f0f0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong style={{ color: '#49493d' }}>{c.title}</strong>
              <span style={{ fontSize: 11, background: '#fecc2a', color: '#49493d', padding: '2px 8px', borderRadius: 999 }}>{c.label}</span>
            </div>
            <div style={{ fontSize: 13, color: '#6E6A61', lineHeight: 1.4 }}>{c.desc}</div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#fecc2a' }}>Tap to view →</div>
          </div>
        ))}

        {/* Live demo state integration */}
        <div style={{ margin: '12px 0', padding: 12, background: '#f8f8f5', borderRadius: 12, fontSize: 13 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Demo State • Live Trip</div>
          {activeTrip ? (
            <div>
              {activeTrip.from} → {activeTrip.to} <span style={{ color: '#fecc2a' }}>({activeTrip.status})</span>
              <button onClick={() => { addRecentAction('Viewed active trip from trips hub'); onNavigate?.('trip-upcoming'); }} style={{ marginLeft: 8, padding: '2px 8px', fontSize: 11, background: '#fecc2a', border: 'none', borderRadius: 4, cursor: 'pointer' }}>View</button>
            </div>
          ) : (
            <div style={{ color: '#6E6A61' }}>No active trip. Book from Home or Choose Car.</div>
          )}
        </div>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button onClick={() => { addRecentAction('Back to home from trips hub'); onNavigate?.('core-home'); }} style={{ background: '#f3f3f3', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer' }}>
            ← Back to Home
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default TripsIndexPage;
