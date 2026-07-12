import React, { useState } from 'react';
import { StatusBar } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { Modal } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ConfirmPickup5PageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPickup5Page: React.FC<ConfirmPickup5PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { info, success } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleBack = () => { addRecentAction('Back from confirm pickup 5'); onNavigate?.('booking-confirm-pickup4'); };
  const handleCall = () => {
    addRecentAction('Called driver from pickup 5');
    // Driver call: attach driver + progress the trip state (defensive)
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, 'in-progress', { driver: 'Push Puttichai · 丰田凯美瑞', eta: '1 min' });
      addRecentAction('Driver call from Confirm5 — driver/ETA via updateTripStatus');
    } else {
      bookTrip({ status: 'in-progress', from: 'Pickup 5', to: '苹果联合广场', driver: '推送', vehicle: '丰田凯美瑞', eta: '1 min', price: 14 });
      addRecentAction('Driver call from Confirm5 — seeded via bookTrip');
    }
    info('拨打司机', '正在拨打司机电话...（演示）');
  };
  const handleSun = () => { addRecentAction('Toggled sunlight mode'); info('日光模式', '已切换日光模式（演示）'); };
  const handleOption = (label: string) => { addRecentAction(`Pickup option: ${label}`); info(label, `${label}（演示）`); };
  const handleCancel = () => { addRecentAction('Opened cancel from pickup 5'); setShowCancelModal(true); };
  const handleSafety = () => {
    addRecentAction('Opened safety from pickup 5');
    // Key safety confirm action: mark progress + safety note via update (or book fallback)
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, activeTrip?.status || 'in-progress', { eta: '安全确认 · 行程中' });
      addRecentAction('Safety confirmed — trip status mutated via updateTripStatus');
    } else {
      bookTrip({ status: 'in-progress', from: 'Current pickup', to: '苹果联合广场', eta: 'Safety confirmed', paid: false });
      addRecentAction('Safety confirmed — trip created via bookTrip');
    }
    info('安全', '打开安全功能（演示）');
  };

  const confirmCancel = () => {
    addRecentAction('Confirmed cancel from pickup 5');
    setShowCancelModal(false);
    success('行程已取消', '返回首页');
    onNavigate?.('core-home');
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 228px 32px 24px' }}>
        <span style={{ width: 16, height: 16, cursor: 'pointer', fontSize: 16, color: '#49493d' }} onClick={handleBack}>↑</span>
        <p style={{ fontSize: 20, fontWeight: 500, color: '#49493d' }}>2 min way</p>
      </div>

      <p style={{ margin: '12px 0 0 113px', fontSize: 14, fontWeight: 500, color: '#49493d' }}>所有司机均经过审核</p>
      <div style={{ margin: '16px 0 0 24px', background: '#f3f3f3', width: 327, height: 1 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 23, padding: '0 24px' }}>
        <div style={{ width: 120, height: 61, background: 'linear-gradient(45deg,#f0f0f0,#e0e0e0)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🚗</div>
        <div style={{ marginTop: 21 }}>
          <p style={{ fontSize: 14, color: '#49493d' }}>丰田凯美瑞</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d', marginLeft: 19 }}>9HTR789</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', margin: '12px 105px 0', minWidth: 165 }}>
        <p style={{ fontSize: 14, color: '#49493d' }}>Push · 4.93</p>
        <span style={{ color: '#fecc2a', fontSize: 10, marginTop: 2 }}>⭐</span>
        <p style={{ fontSize: 14, color: '#49493d' }}>- 3,375 trips</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, padding: '0 16px 0 24px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleCall}><span style={{ fontSize: 14 }}>📞</span></div>
        <div style={{ borderRadius: 24, background: '#fbfbfb', padding: '14px 73px 14px 16px' }}><p style={{ fontSize: 14, color: '#959595' }}>有上车备注吗？</p></div>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleSun}><div style={{ background: '#fecc2a', width: 3, height: 2 }} /></div>
      </div>

      {/* Options */}
      {[
        { icon: '🏠', text: '添加家庭地址', action: '添加或更改', onClick: () => handleOption('添加家庭地址') },
        { icon: '👤', text: '$14', action: '更改', onClick: () => handleOption('Change price') },
        { icon: '📡', text: '与人同行？', action: '分摊车费', onClick: () => handleOption('分摊车费') },
        { icon: '📍', text: '分享行程状态', action: '分享', onClick: () => handleOption('分享状态') }
      ].map((opt, i) => (
        <div key={i} style={{ padding: '8px 21px 19px 24px', cursor: 'pointer' }} onClick={opt.onClick}>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', width: i === 0 ? 105 : i === 1 ? 59 : i === 2 ? 189 : 158 }}>
              <span style={{ fontSize: 14, marginRight: 8 }}>{opt.icon}</span>
              <p style={{ fontSize: 16, color: '#49493d' }}>{opt.text}</p>
            </div>
            <p style={{ fontSize: 12, color: '#fecc2a', marginTop: 7 }}>{opt.action}</p>
          </div>
          <div style={{ marginTop: 11, marginLeft: 3, background: '#f3f3f3', width: 327, height: 1 }} />
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, padding: '0 24px' }}>
        <div style={{ border: '1px solid #fecc2a', borderRadius: 12, padding: '13px 52px', cursor: 'pointer' }} onClick={handleCancel}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#fecc2a' }}>取消</p>
        </div>
        <div style={{ borderRadius: 12, background: '#fecc2a', padding: '14px 56px 14px 54px', cursor: 'pointer' }} onClick={handleSafety}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>安全</p>
        </div>
      </div>

      {/* Driver photo card */}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 40, padding: '0 24px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(45deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>👩‍💼</div>
        <div style={{ marginLeft: 12, marginTop: 5 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>Push Puttichai</p>
          <p style={{ fontSize: 12, color: '#49493d' }}>丰田凯美瑞 · 9HTR789</p>
        </div>
        <div style={{ marginLeft: 85, width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleCall}><span style={{ fontSize: 14 }}>📞</span></div>
      </div>

      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="取消行程"
        destructive
        confirmText="确认取消"
        onConfirm={confirmCancel}
      >
        <p style={{ margin: 0, fontSize: 14, color: '#C9C6BE' }}>确定要取消当前行程吗？</p>
      </Modal>
    </div>
  );
};

export default ConfirmPickup5Page;
