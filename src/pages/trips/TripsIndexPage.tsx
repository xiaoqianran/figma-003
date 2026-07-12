import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripsIndexPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, setActiveTrip, addRecentAction, clearBookedTrips } = useDemoState();
  const cards = [
    { id: 'trips-upcoming', title: '我的行程 - 即将开始', desc: '即将到来的行程页面，展示用户暂无即将到来的行程的空状态。', label: '即将开始' },
    { id: 'trips-past', title: '我的行程 - 历史', desc: '历史行程页面，展示用户过去完成的行程记录。', label: '历史' },
    { id: 'trips-detail-cancelled', title: '行程详情 #1（已取消）', desc: '取消行程详情页面，展示被取消的行程信息。', label: '已取消' },
    { id: 'trips-detail-completed', title: '行程详情 #2（已完成）', desc: '完成行程详情页面，包含完整信息与评价入口。', label: '已完成' },
    { id: 'trips-detail-help', title: '行程详情 #3（帮助）', desc: '帮助和支持页面，包含多种帮助选项与问题分类。', label: '帮助' },
  ];

  return (
    <div className="mobile-frame" style={{ background: '#fff', overflowY: 'auto' }}>
      <StatusBar />

      <div style={{ padding: '16px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 16, color: '#49493d' }}>🚗 我的行程中心</h2>

        {cards.map((c, idx) => (
          <div
            key={idx}
            onClick={() => {
              addRecentAction(`打开行程中心卡片：${c.label}`);
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
            <div style={{ marginTop: 10, fontSize: 12, color: '#fecc2a' }}>点击查看 →</div>
          </div>
        ))}

        {/* Live demo state integration - now shows bookedTrips counts + filtered lists for hub */}
        <div style={{ margin: '12px 0', padding: 12, background: '#f8f8f5', borderRadius: 12, fontSize: 13 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>演示状态 · 实时行程 + 已预订</div>
          {activeTrip ? (
            <div>
              {activeTrip.from} → {activeTrip.to} <span style={{ color: '#fecc2a' }}>({activeTrip.status})</span>
              <button onClick={() => { addRecentAction('从行程中心查看进行中行程'); onNavigate?.('trip-upcoming'); }} style={{ marginLeft: 8, padding: '2px 8px', fontSize: 11, background: '#fecc2a', border: 'none', borderRadius: 4, cursor: 'pointer' }}>查看</button>
            </div>
          ) : (
            <div style={{ color: '#6E6A61' }}>暂无进行中行程。请从首页或选车页预约。</div>
          )}
          <div style={{ marginTop: 8, fontSize: 12 }}>
            已预订：<strong>{bookedTrips.length}</strong> 总计 &nbsp;
            <span style={{color:'#2e7d32'}}>↑{bookedTrips.filter(t=>t.status==='upcoming'||t.status==='in-progress').length} 即将开始</span> &nbsp;
            <span style={{color:'#1565c0'}}>✓{bookedTrips.filter(t=>t.status==='completed').length} 历史</span>
            {bookedTrips.length > 0 && (
              <button onClick={() => { clearBookedTrips?.(); addRecentAction('从中心清空已预订行程'); }} style={{ marginLeft: 8, padding: '1px 6px', fontSize: 10, background: '#eee', border: 'none', borderRadius: 3, cursor: 'pointer' }}>全部清除</button>
            )}
          </div>
          {/* Mini list render from booked for hub view (filtered) */}
          {bookedTrips.length > 0 && (
            <div style={{ marginTop: 6, maxHeight: 80, overflowY: 'auto', fontSize: 11 }}>
              {bookedTrips.slice(0,4).map((t, i) => (
                <div key={i} onClick={() => { setActiveTrip(t); addRecentAction(`从中心列表聚焦 ${t.to}`); onNavigate?.(t.status==='completed' ? 'trips-detail-completed' : 'trip-upcoming'); }} style={{ cursor:'pointer', padding:'2px 4px', borderBottom:'1px dotted #ddd' }}>
                  {t.from}→{t.to} <span style={{opacity:0.6}}>({t.status})</span> → 详情
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <button onClick={() => { addRecentAction('从行程中心返回首页'); onNavigate?.('core-home'); }} style={{ background: '#f3f3f3', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer' }}>
            ← 返回首页
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default TripsIndexPage;
