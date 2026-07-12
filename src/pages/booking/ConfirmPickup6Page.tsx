import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { Modal } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';

interface ConfirmPickup6PageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPickup6Page: React.FC<ConfirmPickup6PageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { info, success } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleBack = () => { addRecentAction('从确认上车点 6 返回'); onNavigate?.('booking-confirm-pickup5'); };
  const handleShare = () => { addRecentAction('已分享行程状态（上车 6）'); info('分享', '分享行程状态给联系人（演示）'); };
  const handleCall = () => {
    addRecentAction('已呼叫司机（上车 6）');
    // Driver call mutation
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, 'in-progress', { driver: 'Push Puttichai · 丰田凯美瑞', eta: '即将到达' });
      addRecentAction('呼叫司机（页6）— 已绑定司机');
    } else {
      bookTrip({ status: 'in-progress', from: '上车确认 6 位置', to: '苹果联合广场', driver: '推送', vehicle: '丰田凯美瑞', eta: '即将到达' });
      addRecentAction('呼叫司机（页6）— 已预订');
    }
    info('拨打', '正在拨打司机电话...（演示）');
  };
  const handleCancel = () => { addRecentAction('从上车确认 6 打开取消'); setShowCancelModal(true); };
  const handleSafety = () => {
    addRecentAction('从上车确认 6 打开安全');
    // Safety confirm key action
    const tripId = activeTrip?.id;
    if (tripId) {
      updateTripStatus(tripId, activeTrip.status || 'in-progress', { eta: '安全检查已通过' });
      addRecentAction('安全已确认（页6）');
    } else {
      bookTrip({ status: 'in-progress', from: '苹果联合广场一带', to: '目的地', eta: '安全已确认' });
      addRecentAction('安全已确认（页6）— 已预订');
    }
    info('安全', '打开安全功能（演示）');
  };
  const handleLearn = () => { addRecentAction('已了解金牌司机'); info('详情', '打开Top Driver详情页面（演示）'); };
  const handleSave = () => { addRecentAction('已保存地点（上车 6）'); success('已保存', '已添加到我的保存地点'); };
  const handleTrusted = () => { addRecentAction('设置紧急联系人'); info('设置', '设置可信联系人（演示）'); };

  const confirmCancel = () => {
    addRecentAction('已确认取消（上车 6）');
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

      {/* Driver */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 40, padding: '0 24px' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(45deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>👩‍💼</div>
        <div style={{ marginLeft: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>Push Puttichai</p>
          <p style={{ fontSize: 12, color: '#49493d' }}>丰田凯美瑞 · 9HTR789</p>
        </div>
        <div style={{ marginLeft: 85, width: 48, height: 48, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleCall}><span style={{ fontSize: 14 }}>📞</span></div>
      </div>

      {/* Top Driver cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, padding: '0 24px' }}>
        {[0,1].map(i => (
          <div key={i} style={{ width: 150, background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 16, fontWeight: 500, color: '#49493d' }}>金牌司机</p>
            <p style={{ marginTop: 12, width: 248, fontSize: 14, color: '#49493d', lineHeight: '20px' }}>与 Gody 及拼车在旧金山都会区出行时，全线路最高可省 15%。优惠可能因行程而异。</p>
            <p style={{ marginTop: 12, fontSize: 12, color: '#fecc2a', textDecoration: 'underline', cursor: 'pointer' }} onClick={i === 0 ? handleLearn : handleLearn}>了解更多</p>
          </div>
        ))}
      </div>

      <p style={{ margin: '16px 0 0 24px', fontSize: 12, color: '#959595' }}>保存此目的地</p>
      <p style={{ margin: '12px 0 0 24px', fontSize: 20, fontWeight: 500, color: '#49493d' }}>苹果联合广场</p>
      <p style={{ margin: '8px 0 0 24px', fontSize: 12, color: '#959595', fontWeight: 500 }}>旧金山 Pos 街 300 号</p>
      <p style={{ margin: '12px 0 0 24px', fontSize: 12, color: '#fecc2a', textDecoration: 'underline', cursor: 'pointer' }} onClick={handleSave}>添加到收藏地点</p>

      {/* Trusted */}
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

export default ConfirmPickup6Page;
