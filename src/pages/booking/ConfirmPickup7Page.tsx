import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { Modal } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ConfirmPickup7PageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPickup7Page: React.FC<ConfirmPickup7PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { success } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleBack = () => { addRecentAction('从确认上车点 7 返回'); onNavigate?.('booking-confirm-pickup6'); };
  const handleShare = () => { addRecentAction('已分享行程状态（上车 7）'); };
  const handleCall = () => {
    addRecentAction('已呼叫司机（上车 7）');
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, 'in-progress', { driver: 'Push Puttichai · 丰田凯美瑞', eta: '下午 4:08 到达' });
      addRecentAction('呼叫司机（页7）— 已更新司机/ETA');
    } else {
      bookTrip({ status: 'in-progress', from: '上车确认 7', to: '苹果联合广场', driver: '推送', vehicle: '丰田凯美瑞', eta: '4:08pm' });
      addRecentAction('呼叫司机（页7）— 已预订');
    }
    // No toast — use live state + inspector instead
  };
  const handleCancel = () => { addRecentAction('从上车确认 7 打开取消'); setShowCancelModal(true); };
  const handleSafety = () => {
    addRecentAction('从上车确认 7 打开安全');
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, activeTrip.status || 'in-progress', { eta: '安全确认 · 下午 4:08' });
      addRecentAction('安全已确认（页7）');
    } else {
      bookTrip({ status: 'in-progress', from: '上车确认 7 位置', to: '苹果联合广场', eta: '安全已确认' });
      addRecentAction('安全已确认（页7）— 已预订');
    }
    // No toast for secondary actions
  };
  const handleLearn = () => { addRecentAction('从上车 7 了解金牌司机'); };
  const handleSave = () => { addRecentAction('已保存地点（上车 7）'); success('已保存', '已添加到我的保存地点'); };
  const handleTrusted = () => { addRecentAction('从上车 7 设置紧急联系人'); };

  const confirmCancel = () => {
    addRecentAction('已确认取消（上车 7）');
    setShowCancelModal(false);
    success('行程已取消', '返回首页');
    onNavigate?.('core-home');
  };

  return (
    <div className="mobile-frame" style={{ height: 1003, overflow: 'hidden' }}>
      <StatusBar />

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 190px 32px 24px' }}>
        <span style={{ width: 16, height: 16, cursor: 'pointer', fontSize: 16, color: '#49493d' }} onClick={handleBack}>↑</span>
        <p style={{ fontSize: 20, fontWeight: 500, color: '#49493d' }}>下午 4:08 到达</p>
      </div>

      <div style={{ padding: '8px 21px 19px 24px', cursor: 'pointer' }} onClick={handleShare}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: 158 }}>
            <span style={{ fontSize: 14, marginRight: 8 }}>📍</span>
            <p style={{ fontSize: 16, color: '#49493d' }}>分享行程状态</p>
          </div>
          <p style={{ fontSize: 12, color: '#fecc2a', marginTop: 7 }}>分享</p>
        </div>
        <div style={{ marginTop: 11, marginLeft: 3, background: '#f3f3f3', width: 327, height: 1 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, padding: '0 24px' }}>
        <div style={{ borderRadius: 12, background: '#f3f3f3', padding: '13px 53px 15px', cursor: 'pointer' }} onClick={handleCancel}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>取消</p>
        </div>
        <div style={{ borderRadius: 12, background: '#fecc2a', padding: '14px 56px 14px 54px', cursor: 'pointer' }} onClick={handleSafety}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>安全</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 40, padding: '0 24px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(45deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>👩‍💼</div>
        <div style={{ marginLeft: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>Push Puttichai</p>
          <p style={{ fontSize: 12, color: '#49493d' }}>丰田凯美瑞 · 9HTR789</p>
        </div>
        <div style={{ marginLeft: 85, width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleCall}><span style={{ fontSize: 14 }}>📞</span></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, padding: '0 24px' }}>
        {[0,1].map(i => (
          <div key={i} style={{ width: 150, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>金牌司机</p>
            <p style={{ marginTop: 12, width: 248, fontSize: 14, color: '#49493d', lineHeight: '20px' }}>与 Gody 及拼车在旧金山都会区出行时，全线路最高可省 15%。优惠可能因行程而异。</p>
            <p style={{ marginTop: 12, fontSize: 12, color: '#fecc2a', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleLearn}>{i === 0 ? '了解更多' : '查看资料'}</p>
          </div>
        ))}
      </div>

      <p style={{ margin: '16px 0 0 24px', fontSize: 12, color: '#959595' }}>保存此目的地</p>
      <p style={{ margin: '12px 0 0 24px', fontSize: 20, fontWeight: 500, color: '#49493d' }}>苹果联合广场</p>
      <p style={{ margin: '8px 0 0 24px', fontSize: 12, color: '#959595', fontWeight: 500 }}>旧金山 Pos 街 300 号</p>
      <p style={{ margin: '12px 0 0 24px', fontSize: 12, color: '#fecc2a', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleSave}>添加到收藏地点</p>

      <div style={{ margin: '24px 24px 0', background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
        <p style={{ fontSize: 12, color: '#959595' }}>紧急联系人</p>
        <p style={{ marginTop: 8, fontSize: 20, fontWeight: 500, color: '#49493d' }}>苹果联合广场</p>
        <p style={{ marginTop: 16, width: 295, fontSize: 14, color: '#49493d', lineHeight: '20px' }}>与 Gody 及拼车在旧金山都会区出行时，全线路最高可省 15%。优惠可能因行程而异。</p>
        <div style={{ marginTop: 12, background: '#f3f3f3', width: 295, height: 1 }} />
        <p style={{ marginTop: 11, fontSize: 14, color: '#49493d', cursor: 'pointer' }} onClick={handleTrusted}>设置紧急联系人</p>
      </div>

      <p style={{ margin: '16px 0 0 24px', fontSize: 12, color: '#959595' }}>Visa 本地优惠：9 月 18–25 日</p>
      <p style={{ margin: '8px 0 0 24px', width: 327, fontSize: 20, fontWeight: 500, color: '#49493d' }}>在市区使用 Visa 卡可获得 Gody 现金</p>

      <div style={{ display: 'flex', marginTop: 24, padding: '21px 121px 8px 120px' }}>
        <div style={{ borderRadius: 100, background: '#49493d', width: 134, height: 5 }} />
      </div>

      <HomeIndicator />

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

export default ConfirmPickup7Page;
