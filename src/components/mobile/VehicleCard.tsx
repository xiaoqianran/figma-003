import React from 'react';

export interface VehicleCardProps {
  icon?: string;
  name: string;
  description?: string;
  price: number | string;
  selected?: boolean;
  onClick?: () => void;
  // Optional richer info from original prototypes
  seats?: number | string;
  eta?: string;
  className?: string;
  children?: React.ReactNode;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  icon = '🚗',
  name,
  description,
  price,
  selected,
  onClick,
  seats,
  eta,
  className = '',
  children,
}) => {
  const priceStr = typeof price === 'number' ? `$${price.toFixed(2)}` : price;

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`vehicle-card ${selected ? 'selected' : ''} ${className}`}
      style={{
        margin: '8px 20px 0',
        padding: '12px 16px',
        borderRadius: 14,
        border: selected ? '2px solid #f0b429' : '1px solid #e8e8e8',
        background: selected ? '#fffbeb' : '#ffffff',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: 28, marginRight: 12 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#0A0908' }}>{name}</div>
        {description && (
          <div style={{ fontSize: 12, color: '#6E6A61', marginTop: 2 }}>{description}</div>
        )}
        {(seats || eta) && (
          <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12 }}>
            {seats && (
              <span style={{ color: '#49493d' }}>👤 {seats}</span>
            )}
            {eta && (
              <span style={{ color: '#49493d' }}>🕐 {eta}</span>
            )}
          </div>
        )}
        {children}
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, color: '#0A0908', marginLeft: 12 }}>{priceStr}</div>
    </div>
  );
};

export default VehicleCard;
