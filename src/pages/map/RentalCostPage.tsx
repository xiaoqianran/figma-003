import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface RentalCostPageProps {
  onNavigate?: (pageId: string) => void;
}

const RentalCostPage: React.FC<RentalCostPageProps> = ({ onNavigate }) => {
  const { info } = useToast();
  const { activeTrip, addRecentAction, selectedPayment } = useDemoState();
  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 22, cursor: 'pointer' }} onClick={() => { addRecentAction('从租车费用返回'); onNavigate?.('map-home'); }}>←</span>
        <div style={{ background: '#fff', padding: '8px 24px', borderRadius: 12, boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }} onClick={() => addRecentAction('从租车页打开帮助')}>帮助</div>
      </div>
      {activeTrip && <div style={{ padding: '0 24px 4px', fontSize: 11 }}>进行中行程前往 {activeTrip.to} · 支付方式 {selectedPayment.label}</div>}

      <div style={{ height: 660, background: 'linear-gradient(135deg,#e8f4f8 0%,#d4edda 50%,#fff3cd 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 255, left: 30, width: 268, height: 246, background: 'linear-gradient(45deg,transparent,#fecc2a,transparent)', opacity: 0.7, borderRadius: '50%' }} />

        <div style={{ position: 'absolute', top: 287, right: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div onClick={() => { addRecentAction('在租车费用页定位'); info('地图', '定位 （演示）'); }} style={{ background: '#fff', padding: 14, borderRadius: '50%', boxShadow: '0 4px 40px rgba(0,0,0,0.1)', cursor: 'pointer' }}>🎯</div>
          <div onClick={() => { addRecentAction('从租车费用查看路线'); onNavigate?.('map-route'); }} style={{ background: '#fff', padding: 14, borderRadius: '50%', boxShadow: '0 4px 40px rgba(0,0,0,0.1)', cursor: 'pointer' }}>✅</div>
        </div>

        <div style={{ position: 'absolute', top: 154, left: 76, background: '#fecc2a', borderRadius: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', width: 110, cursor: 'pointer' }} onClick={() => { addRecentAction('租车中已选择 GodyX'); info('车辆', 'GodyX（演示）'); }}>
          <div style={{ background: '#fff', padding: '4px 14px', borderRadius: '12px 0 0 12px' }}>🚗 GodyX</div>
          <div style={{ fontSize: 12, paddingLeft: 8, lineHeight: 1 }}>10<br/>分钟</div>
        </div>

        {/* Cost Card */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px', boxShadow: '0 -4px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 18 }}>租车费用</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
            <div>最低车费</div>
            <div style={{ fontWeight: 500 }}>$2.20</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0' }}>
            <div>额外时间</div>
            <div style={{ fontWeight: 500 }}>$2.70</div>
          </div>

          <button onClick={() => { addRecentAction('从租车费用选择支付'); onNavigate?.('payment-select'); }} style={{ marginTop: 20, width: '100%', background: '#fecc2a', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
            选择支付方式
          </button>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default RentalCostPage;
