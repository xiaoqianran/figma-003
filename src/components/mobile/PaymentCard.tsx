import React from 'react';

export interface PaymentCardProps {
  type?: 'visa' | 'gody' | 'alipay' | 'wechat' | 'other';
  lastDigits?: string;
  label?: string;
  selected?: boolean;
  onClick?: () => void;
  showAdd?: boolean; // for "添加支付" variant
  children?: React.ReactNode;
  className?: string;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  type = 'visa',
  lastDigits = '4242',
  label,
  selected,
  onClick,
  showAdd,
  children,
  className = '',
}) => {
  if (showAdd) {
    return (
      <div
        onClick={onClick}
        className={`payment-card add-payment-card ${className}`}
        style={{
          margin: '12px 24px 0',
          border: '2px dashed #bdbdbd',
          background: '#fff',
          cursor: 'pointer'
        }}
      >
        <div style={{ color: '#bdbdbd', fontSize: 14, fontWeight: 500 }}>
          {label || '添加支付方式'}
        </div>
      </div>
    );
  }

  const renderLogo = () => {
    if (type === 'visa') {
      return <div style={{ background: '#143c8a', color: '#fff', padding: '2px 8px', borderRadius: 3, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>VISA</div>;
    }
    if (type === 'gody') {
      return <div style={{ background: '#ca8a04', color: '#0A0908', padding: '2px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>GODY</div>;
    }
    if (type === 'alipay') {
      return <span style={{ fontSize: 18 }}>💰</span>;
    }
    if (type === 'wechat') {
      return <span style={{ fontSize: 18 }}>💚</span>;
    }
    return <div style={{ fontSize: 14, color: '#6E6A61' }}>{type.toUpperCase()}</div>;
  };

  const displayLabel = label || (type === 'gody' ? 'Gody 现金' : `···· ${lastDigits}`);

  return (
    <div
      onClick={onClick}
      className={`payment-card ${selected ? 'selected' : ''} ${className}`}
      style={{
        margin: '12px 24px 0',
        border: selected ? '2px solid #ca8a04' : '1px solid #e8e8e8',
        background: '#fff',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {renderLogo()}
        <div style={{ fontSize: 14, color: '#0A0908' }}>{displayLabel}</div>
      </div>

      {selected && (
        <div style={{ color: '#00b894', fontSize: 18, fontWeight: 700 }}>✓</div>
      )}

      {children}
    </div>
  );
};

export default PaymentCard;