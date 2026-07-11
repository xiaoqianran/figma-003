import React, { useState } from 'react';
import { StatusBar, HomeIndicator, TopNav, VehicleCard } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ChooseCarPageProps {
  onNavigate?: (pageId: string) => void;
}

const ChooseCarPage: React.FC<ChooseCarPageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, selectedPayment, bookTrip } = useDemoState();
  const { error, success, info } = useToast();
  const [selected, setSelected] = useState<string | null>(null);

  const vehicles = [
    { id: 'godyx', name: 'GodyX', desc: 'Affordable rides, all to yourself', price: 22.00, icon: '🚗' },
    { id: 'suv', name: 'Black SUV', desc: 'Affordable rides, all to yourself', price: 17.00, icon: '🚙' },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleSchedule = () => {
    if (!selected) {
      error('请选择车辆', '请先选择您的出行方式');
      return;
    }
    const v = vehicles.find(x => x.id === selected);
    if (!v) return;

    // Use activeTrip.to (prefilled/passed from Search1Page/Search2Page via prior bookTrip) so ChooseCar feels connected to searched destination
    const destTo = activeTrip?.to || 'Apple Union Square';
    const destFrom = activeTrip?.from || '51 Sharon St';
    // Use new bookTrip for persistent multi-trip history + active focus
    const booked = bookTrip({
      status: 'upcoming',
      from: destFrom,
      to: destTo,
      vehicle: v.name,
      price: v.price,
      eta: '3:50 PM',
    });
    addRecentAction(`Booked ${v.name} to ${booked.to} ($${v.price}) via ChooseCar`);

    success('车辆已选择', `${v.name} • $${v.price}（演示）`);
    onNavigate?.('booking-confirm-pickup1');
  };

  return (
    <div className="mobile-frame mobile-frame-tall" style={{ height: 858 }}>
      <StatusBar dark />

      {/* Map background */}
      <div className="map-mock" style={{ position: 'absolute', top: 0, left: 0, width: 375, height: 858, zIndex: 0 }}>
        <div className="map-mock-grid" />
        <div style={{ position: 'absolute', top: 180, left: 80, fontSize: 18, zIndex: 5 }}>📍</div>
        <div style={{ position: 'absolute', top: 260, left: 240, fontSize: 18, zIndex: 5 }}>🛤️</div>
        <div style={{
          position: 'absolute', top: 190, left: 120, background: '#fff', padding: '4px 10px',
          borderRadius: 999, fontSize: 11, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10,
          border: '1px solid rgba(254,204,42,0.25)',
        }}>
          {(activeTrip?.to || 'Apple Union Square')} <span style={{ fontSize: 10 }}>🕐</span>
        </div>
      </div>

      <TopNav onBack={() => onNavigate?.('core-home')} />

      {/* 定位按钮 */}
      <button
        type="button"
        className="map-fab"
        style={{ position: 'absolute', top: 220, right: 24, zIndex: 10 }}
        aria-label="Relocate"
        onClick={() => info('重新定位', '当前位置已更新（演示）')}
      >
        🎯
      </button>

      {/* 底部车辆选择面板 */}
      <div
        className="bottom-sheet"
        style={{
          position: 'absolute', top: 396, left: 0, width: 375, height: 462,
          paddingTop: 28, zIndex: 5,
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ marginLeft: 24, color: '#49493d', fontSize: 14, fontWeight: 500, marginTop: 4 }}>
          选择您的出行方式
        </div>

        {vehicles.map(v => (
          <VehicleCard
            key={v.id}
            icon={v.icon}
            name={v.name}
            description={v.desc}
            price={v.price}
            selected={selected === v.id}
            onClick={() => handleSelect(v.id)}
          />
        ))}

        {/* 支付卡片 — shared payment-card class for hover/focus */}
        <div
          className={`payment-card${selectedPayment ? '' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('payment-select')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate?.('payment-select');
            }
          }}
          style={{ margin: '20px 24px 0' }}
        >
          {selectedPayment.type === 'visa' ? (
            <div style={{ background: '#143c8a', color: '#fff', padding: '2px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>VISA</div>
          ) : (
            <div style={{ background: '#fecc2a', color: '#0A0908', padding: '2px 6px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>GODY</div>
          )}
          <div style={{ marginLeft: 12, fontSize: 13 }}>{selectedPayment.label}</div>
          <div style={{ marginLeft: 'auto', color: '#6E6A61', fontSize: 12 }}>更改 →</div>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={handleSchedule}
          style={{ margin: '24px 24px 0', height: 48, width: 'calc(100% - 48px)' }}
        >
          Schedule {selected ? vehicles.find(v => v.id === selected)?.name : 'Ride'}
        </button>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default ChooseCarPage;
