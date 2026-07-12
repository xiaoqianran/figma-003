import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';
import styles from './TripDetailCompletedPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripDetailCompletedPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, addRecentAction, completeTrip, cancelTrip, updateTripStatus } = useDemoState();
  const { info, success } = useToast();
  const goBack = () => onNavigate?.('trips-past');

  const handleHelp = () => {
    addRecentAction('从已完成详情请求帮助');
    onNavigate?.('trips-detail-help');
  };

  const handlePayment = () => {
    addRecentAction('从行程详情切换支付');
    if (activeTrip?.id) updateTripStatus(activeTrip.id, 'completed', { paid: true });
    info('支付', '打开支付方式编辑页面 （演示）');
    onNavigate?.('payment-select');
  };

  const handleRate = () => {
    addRecentAction('打开已完成行程评价');
    // Enhanced: functional rate that ensures paid via mutation + toasts + nav
    if (activeTrip?.id) {
      updateTripStatus(activeTrip.id, 'completed', { paid: true });
    }
    success('感谢', '评价已提交（通过 updateTripStatus 演示）');
    onNavigate?.('other-evaluate1');
  };

  // NEW functional mutation buttons for detail page (Cancel/Complete/Rate via APIs)
  const handleCompleteAgain = () => {
    const id = activeTrip?.id;
    if (id) {
      completeTrip(id);
      addRecentAction('从详情再次完成行程');
      success('完成', '行程已标记完成并已支付');
    } else {
      info('演示', '无当前行程 ID');
    }
  };

  const handleCancelFromDetail = () => {
    const id = activeTrip?.id;
    addRecentAction('从已完成详情调用取消（演示）');
    if (id) {
      cancelTrip(id);
    }
    onNavigate?.('trips-past');
  };

  const handleMarkPaid = () => {
    const id = activeTrip?.id;
    if (id) {
      updateTripStatus(id, 'completed', { paid: true });
      addRecentAction('已通过 updateTripStatus 标记已付');
      success('支付', '已标记为已支付');
    }
  };

  // Log view naturally on render (demo only)
  React.useEffect(() => {
    addRecentAction('查看已完成行程详情');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mobile-frame" style={{ background: '#fff' }}>
      <StatusBar />

      <div className={styles.container}>
        <div className={styles.titleBar}>
          <span className={styles.backIcon} onClick={goBack}>←</span>
          <span className={styles.title}>行程详情</span>
        </div>

        {/* Map */}
        <div className={styles.mapArea}>
          <div className={styles.mapGrid} />
          <div style={{ position: 'absolute', top: 23, left: 120, width: 112, height: 106, border: '3px solid #4ecdc4', borderRadius: 50, transform: 'rotate(61deg)', opacity: 0.65 }} />
          <div style={{ position: 'absolute', top: 111, left: 180, fontSize: 18 }}>📍</div>
        </div>

        <div className={styles.tripRow}>
          <div className={styles.tripTime}>今天 下午 3:45 </div>
          <div className={styles.tripPrice}>${activeTrip?.price || 17}.00</div>
        </div>
        <div className={styles.vehicleInfo}>{activeTrip?.vehicle || '丰田凯美瑞'} - 9HTR789{activeTrip?.driver ? ` · ${activeTrip.driver}` : ''}</div>

        {/* Locations */}
        <div className={styles.locationSection}>
          <div className={styles.locationIcons}>
            <div className={styles.hereDot}><div className={styles.hereDotInner} /></div>
            <div className={styles.locationLine} />
            <div className={styles.locationPin}>📍</div>
          </div>
          <div className={styles.locationInputs}>
            <div className={styles.locInput}>{activeTrip?.to || '苹果联合广场'}</div>
            <div className={styles.locInput}>{activeTrip?.from || '旧金山国际机场'}</div>
          </div>
        </div>

        {/* Rating */}
        <div className={styles.ratingRow}>
          <div className={styles.avatar}>👤</div>
          <div className={styles.ratingLabel}>您已评价 Push</div>
          <div className={styles.ratingStars}>
            {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: '#fecc2a', fontSize: 16 }}>★</span>)}
          </div>
        </div>

        <div className={styles.helpLink} onClick={handleHelp}>需要本次行程的帮助吗？</div>

        {/* Action cards */}
        <div className={styles.actionRow}>
          <div className={styles.actionCard} onClick={handlePayment}>
            <div className={styles.actionTitle}>切换支付方式</div>
            <div className={styles.actionDesc}>我想更换本次行程的支付方式。</div>
            <div className={styles.actionLink}>编辑支付</div>
          </div>
          <div className={styles.actionCard} onClick={handleRate}>
            <div className={styles.actionTitle}>评价行程</div>
            <div className={styles.actionDesc}>分享您对司机的评价。</div>
            <div className={styles.actionLink}>立即评价 →</div>
          </div>
        </div>

        {/* NEW: functional mutation action bar for Cancel / Complete / Rate (and paid) using DemoState APIs */}
        <div style={{ padding: '0 24px', marginTop: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#959595', marginBottom: 6 }}>演示操作（通过接口更新状态）：</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={handleMarkPaid} style={{ flex: 1, minWidth: 70, padding: '8px 10px', fontSize: 12, background: '#e3f2fd', border: 'none', borderRadius: 8, cursor: 'pointer' }}>标记已支付</button>
            <button onClick={handleCompleteAgain} style={{ flex: 1, minWidth: 70, padding: '8px 10px', fontSize: 12, background: '#e8f5e9', border: 'none', borderRadius: 8, cursor: 'pointer' }}>完成</button>
            <button onClick={handleCancelFromDetail} style={{ flex: 1, minWidth: 70, padding: '8px 10px', fontSize: 12, background: '#ffebee', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#c62828' }}>取消</button>
            <button onClick={() => { addRecentAction('通过操作栏评价'); handleRate(); }} style={{ flex: 1, minWidth: 70, padding: '8px 10px', fontSize: 12, background: '#fff8e1', border: 'none', borderRadius: 8, cursor: 'pointer' }}>评分</button>
          </div>
          {activeTrip && <div style={{ fontSize: 10, marginTop: 4, color: '#6E6A61' }}>进行中： {activeTrip.id} ({activeTrip.status}, paid: {String(!!activeTrip.paid)})</div>}
          {/* Also show count from booked for continuity */}
          {bookedTrips.length > 0 && <div style={{ fontSize: 10, color: '#959595' }}>状态中已预订总数：{bookedTrips.length}</div>}
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default TripDetailCompletedPage;
