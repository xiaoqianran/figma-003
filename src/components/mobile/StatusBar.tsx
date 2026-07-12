import React from 'react';

interface StatusBarProps {
  time?: string;
  dark?: boolean;
  transparent?: boolean;
  children?: React.ReactNode;
}

const StatusBar: React.FC<StatusBarProps> = ({ time = '9:41', dark = false, transparent = false, children }) => {
  const textColor = dark ? '#3a3942' : '#111318';
  const bg = transparent ? 'transparent' : 'transparent';

  return (
    <div className="status-bar" style={{ background: bg }}>
      <div className="status-bar-content">
        <span className="time" style={{ color: textColor }}>{time}</span>
        {children ? (
          children
        ) : (
          <div className="status-icons" style={{ color: textColor, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, letterSpacing: 0.5 }}>●●●●</span>
            <span style={{ fontSize: 12 }}>Wi‑Fi</span>
            <span style={{
              display: 'inline-block',
              width: 22,
              height: 11,
              borderRadius: 3,
              border: `1.5px solid ${textColor}`,
              opacity: 0.7,
              position: 'relative',
            }}>
              <span style={{
                position: 'absolute',
                left: 1.5,
                top: 1.5,
                bottom: 1.5,
                width: '65%',
                borderRadius: 1,
                background: textColor,
              }} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
