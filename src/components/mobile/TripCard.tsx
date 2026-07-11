import React from 'react';

export interface TripCardProps {
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  title: string;
  time: string;
  from: string;
  to: string;
  price?: string;
  driver?: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  upcoming: { bg: '#E8F4E8', text: '#2E7D32', label: '即将开始' },
  'in-progress': { bg: '#FFF3E0', text: '#E65100', label: '进行中' },
  completed: { bg: '#E3F2FD', text: '#1565C0', label: '已完成' },
  cancelled: { bg: '#FFEBEE', text: '#C62828', label: '已取消' },
};

const TripCard: React.FC<TripCardProps> = ({ status, title, time, from, to, price, driver, onClick, selected, className = '' }) => {
  const s = statusColors[status] || statusColors.upcoming;

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`trip-card ${selected ? 'selected' : ''} ${className}`}
      style={{
        margin: '8px 24px',
        padding: '14px 16px',
        background: selected ? '#fffdf5' : '#fff',
        borderRadius: 14,
        border: selected ? '2px solid #fecc2a' : '1px solid #eee',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: s.bg, color: s.text, fontWeight: 500 }}>{s.label}</div>
      </div>
      <div style={{ fontSize: 12, color: '#6E6A61', marginTop: 4 }}>{time}</div>
      <div style={{ marginTop: 8, fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}>
        <span>{from}</span>
        <span style={{ color: '#fecc2a' }}>→</span>
        <span>{to}</span>
      </div>
      {(price || driver) && (
        <div style={{ marginTop: 6, fontSize: 12, color: '#49493d', display: 'flex', gap: 12 }}>
          {price && <span>¥{price}</span>}
          {driver && <span>司机：{driver}</span>}
        </div>
      )}
    </div>
  );
};

export default TripCard;
