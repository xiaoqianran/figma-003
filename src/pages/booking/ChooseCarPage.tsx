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
  const [selected, setSelected] = useState<string | null>('godyx');

  const vehicles = [
    { id: 'godyx', name: 'GodyX', desc: '经济实惠 · 4 座 · 静音电动', price: 22.0, icon: '🚗' },
    { id: 'suv', name: '黑金 SUV', desc: '宽敞空间 · 高端舒适', price: 17.0, icon: '🚙' },
  ];

  const handleSchedule = () => {
    if (!selected) {
      error('请选择车辆', '请先选择您的出行方式');
      return;
    }
    const v = vehicles.find((x) => x.id === selected);
    if (!v) return;

    const destTo = activeTrip?.to || '苹果联合广场';
    const destFrom = activeTrip?.from || '当前定位';
    const booked = bookTrip({
      status: 'upcoming',
      from: destFrom,
      to: destTo,
      vehicle: v.name,
      price: v.price,
      eta: '下午 3:50',
    });
    addRecentAction(`通过选车页预订 ${v.name} 前往 ${booked.to}（¥${v.price}）`);
    success('车辆已选择', `${v.name} · ¥${v.price}（演示）`);
    onNavigate?.('booking-confirm-pickup1');
  };

  // Layout fits entirely in 375×812 device screen — sheet bottom-anchored with compact rows
  return (
    <div className="mobile-frame" style={{ background: '#f7f6f3' }}>
      <div className="map-mock" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div className="map-mock-grid" />
        <div style={{ position: 'absolute', top: 150, left: 72, fontSize: 20, zIndex: 5 }}>📍</div>
        <div
          style={{
            position: 'absolute',
            top: 158,
            left: 104,
            background: '#fff',
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(17,19,24,0.1)',
            zIndex: 10,
            border: '1px solid #ebe9e4',
            color: '#111318',
          }}
        >
          {activeTrip?.to || '苹果联合广场'}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 5 }}>
        <StatusBar dark />
        <TopNav onBack={() => onNavigate?.('core-home')} />
      </div>

      <button
        type="button"
        className="map-fab"
        style={{ position: 'absolute', top: 200, right: 20, zIndex: 10 }}
        aria-label="重新定位"
        onClick={() => info('重新定位', '当前位置已更新（演示）')}
      >
        ◎
      </button>

      <div
        className="bottom-sheet"
        data-testid="choose-car-sheet"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 'auto',
          width: 375,
          height: 'auto',
          maxHeight: 460,
          paddingTop: 12,
          paddingBottom: 0,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '28px 28px 0 0',
          background: '#fff',
          boxShadow: '0 -12px 40px rgba(17,19,24,0.12)',
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 999, background: '#e4e2dc', margin: '0 auto 10px', flexShrink: 0 }} />
        <div style={{ margin: '0 20px 2px', color: '#111318', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', flexShrink: 0 }}>
          选择出行方式
        </div>
        <div style={{ margin: '0 20px 8px', fontSize: 11, color: '#9b9aa3', flexShrink: 0 }}>
          价格含税 · 预计到达时间基于您的位置
        </div>

        <div style={{ flex: '0 1 auto', overflow: 'hidden' }}>
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              icon={v.icon}
              name={v.name}
              description={v.desc}
              price={v.price}
              selected={selected === v.id}
              onClick={() => setSelected(v.id)}
              className="choose-car-vehicle"
            />
          ))}
        </div>

        <div
          className="payment-card"
          role="button"
          tabIndex={0}
          data-testid="choose-car-payment"
          onClick={() => onNavigate?.('payment-select')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate?.('payment-select');
            }
          }}
          style={{ margin: '8px 20px 0', padding: '12px 16px', flexShrink: 0 }}
        >
          {selectedPayment.type === 'visa' ? (
            <div style={{ background: '#143c8a', color: '#fff', padding: '3px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700 }}>
              VISA
            </div>
          ) : (
            <div style={{ background: '#ca8a04', color: '#14110a', padding: '3px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700 }}>
              GODY
            </div>
          )}
          <div style={{ marginLeft: 12, fontSize: 13, fontWeight: 550 }}>{selectedPayment.label}</div>
          <div style={{ marginLeft: 'auto', color: '#6b6a73', fontSize: 12, fontWeight: 500 }}>更改 →</div>
        </div>

        <button
          type="button"
          className="primary-btn"
          data-testid="choose-car-schedule"
          onClick={handleSchedule}
          style={{ margin: '12px 20px 0', height: 48, width: 'calc(100% - 40px)', flexShrink: 0 }}
        >
          预约 {selected ? vehicles.find((v) => v.id === selected)?.name : '行程'}
        </button>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default ChooseCarPage;
