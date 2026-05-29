import React from 'react';

interface StatusBarProps {
  time?: string;
  dark?: boolean; // for map pages that use dark text on light or vice versa
  transparent?: boolean;
  children?: React.ReactNode; // custom right side content
}

const StatusBar: React.FC<StatusBarProps> = ({ time = '9:09', dark = false, transparent = false, children }) => {
  const textColor = dark ? '#49493d' : '#000000';
  const bg = transparent ? 'transparent' : (dark ? 'transparent' : '#ffffff');
  
  return (
    <div className="status-bar" style={{ background: bg }}>
      <div className="status-bar-content">
        <span className="time" style={{ color: textColor }}>{time}</span>
        {children ? (
          children
        ) : (
          <div className="status-icons" style={{ color: textColor }}>
            <span>📶</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
