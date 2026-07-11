import React from 'react';

interface TopNavProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  leftAction?: React.ReactNode; // custom left instead of back arrow
  dark?: boolean; // for light map backgrounds
  className?: string;
}

const TopNav: React.FC<TopNavProps> = ({ 
  title, 
  subtitle, 
  onBack, 
  rightAction, 
  leftAction, 
  dark = false,
  className = ''
}) => {
  const textColor = dark ? '#49493d' : '#49493d';

  return (
    <div className={`top-nav ${className}`} style={{ color: textColor }}>
      {leftAction ? (
        <div onClick={onBack} style={{ display: 'flex', alignItems: 'center' }}>{leftAction}</div>
      ) : onBack ? (
        <span
          className="back-arrow"
          onClick={onBack}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onBack(); } }}
          role="button"
          tabIndex={0}
          aria-label="返回"
          style={{ color: textColor }}
        >←</span>
      ) : (
        <span style={{ width: 16 }} />
      )}
      
      <div style={{ flex: 1, textAlign: 'center' }}>
        {title && <div className="nav-title" style={{ color: '#0A0908', marginRight: rightAction ? 0 : 16 }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 11, color: '#6E6A61', marginTop: -4 }}>{subtitle}</div>}
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>{rightAction}</div>
    </div>
  );
};

export default TopNav;
