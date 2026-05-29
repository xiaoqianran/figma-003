import React from 'react';

export interface MapPin {
  id?: string | number;
  x: number;   // percent 0-100 from left
  y: number;   // percent 0-100 from top
  icon?: string;
  label?: string;
  selected?: boolean;
  onClick?: () => void;
}

export interface MapMockProps {
  height?: number | string;
  children?: React.ReactNode; // allow overlay content
  pins?: MapPin[];
  showGrid?: boolean;
  route?: { from: { x: number; y: number }; to: { x: number; y: number } } | null;
  className?: string;
  style?: React.CSSProperties;
  onPinClick?: (pin: MapPin) => void;
  // Additional decorative elements like cars or markers
  markers?: Array<{ x: number; y: number; icon: string }>;
}

const MapMock: React.FC<MapMockProps> = ({
  height = 380,
  children,
  pins = [],
  showGrid = true,
  route = null,
  className = '',
  style,
  onPinClick,
  markers = [],
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: typeof height === 'number' ? `${height}px` : height,
    background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
    overflow: 'hidden',
    ...style,
  };

  const gridStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    pointerEvents: 'none',
  };

  return (
    <div className={`map-mock ${className}`} style={containerStyle}>
      {showGrid && <div className="map-mock-grid" style={gridStyle} />}

      {/* Optional route line */}
      {route && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line
            x1={route.from.x}
            y1={route.from.y}
            x2={route.to.x}
            y2={route.to.y}
            stroke="#fecc2a"
            strokeWidth="1.5"
            strokeOpacity="0.65"
            strokeDasharray="3 2"
          />
        </svg>
      )}

      {/* Decorative markers (cars, dots etc) */}
      {markers.map((m, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: `${m.x}%`,
            top: `${m.y}%`,
            fontSize: 18,
            transform: 'translate(-50%, -50%)',
            zIndex: 4,
            pointerEvents: 'none'
          }}
        >
          {m.icon}
        </div>
      ))}

      {/* Configurable pins */}
      {pins.map((pin, idx) => (
        <div
          key={pin.id ?? idx}
          className={`map-pin ${pin.selected ? 'selected' : ''}`}
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: pin.selected ? 10 : 5,
          }}
          onClick={() => {
            pin.onClick?.();
            onPinClick?.(pin);
          }}
          title={pin.label}
        >
          {pin.icon || '📍'}
          {pin.label && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translate(-50%, 4px)',
              background: '#fff',
              padding: '1px 6px',
              borderRadius: 999,
              fontSize: 10,
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              color: '#49493d'
            }}>
              {pin.label}
            </div>
          )}
        </div>
      ))}

      {/* Children overlays (location labels, buttons, etc) */}
      {children}
    </div>
  );
};

export default MapMock;