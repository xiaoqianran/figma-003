import React, { useState, useEffect } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { Modal } from '../../components/ui';
import styles from './RequestingPage.module.css';
import { useDemoState } from '../../context/DemoStateContext';

interface RequestingPageProps {
  onNavigate?: (pageId: string) => void;
}

const RequestingPage: React.FC<RequestingPageProps> = ({ onNavigate }) => {
  const { activeTrip, selectedPayment: _selectedPayment, addRecentAction: _addRecentAction, updateTripStatus, setActiveTrip, bookTrip } = useDemoState();
  const { info, success } = useToast();
  const [countdown, setCountdown] = useState({ min: 8, sec: 39 });
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { min, sec } = prev;
        sec--;
        if (sec < 0) {
          sec = 59;
          min--;
        }
        if (min < 0) {
          clearInterval(timer);
          return { min: 0, sec: 0 };
        }
        return { min, sec };
      });
    }, 1000);

    // Stop after 5s like original demo
    const stop = setTimeout(() => clearInterval(timer), 5000);
    return () => { clearInterval(timer); clearTimeout(stop); };
  }, []);

  const handleAction = (type: string) => {
    if (type === 'payment') onNavigate?.('payment-select');
    else if (type === 'dest') info('目的地', '打开目的地选择（演示）');
    else info(type, `${type} 操作（演示）`);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    setActiveTrip(null);
    _addRecentAction('Cancelled ride request');
    success('行程已取消', '请求已取消，返回首页');
    onNavigate?.('core-home');
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 217px 32px 24px' }}>
        <span style={{ width: 16, height: 16, cursor: 'pointer', fontSize: 16, color: '#49493d' }} onClick={() => onNavigate?.('booking-confirm-pickup3')}>↑</span>
        <span style={{ fontSize: 20, fontWeight: 500, color: '#49493d' }}>Requesting</span>
      </div>

      <div className={styles.tripInfoCard}>
        <p className={styles.pickupTime}>
          <span>Pick up in&nbsp;</span>
          <span className={styles.timeValue}>{countdown.min}m {countdown.sec}s</span>
        </p>
        <p className={styles.destination}>To {activeTrip?.to || 'Apple Union Square'}</p>
        <p className={styles.departureInfo}>At {activeTrip?.eta || '3:50 PM'} from {activeTrip?.from || '51 Sharon St'}</p>
        <p className={styles.priceRange}>${activeTrip?.price || '13'}-{activeTrip?.price ? Math.round(activeTrip.price + 3) : '16'}</p>
      </div>

      <div className={styles.actionCard}>
        <div className={styles.actionItem} onClick={() => handleAction('dest')}>
          <div className={styles.actionContent}>
            <span className={styles.actionIcon}>📍</span>
            <span className={styles.actionText}>Apple Union Square</span>
            <span className={styles.actionLink}>Add or change</span>
          </div>
          <div className={styles.divider} />
        </div>

        <div className={styles.actionItem} onClick={() => handleAction('payment')}>
          <div className={styles.actionContent}>
            <span className={styles.actionIcon}>💳</span>
            <span className={styles.actionText}>{_selectedPayment.label}</span>
            <span className={`${styles.actionLink} ${styles.actionLink}`}>Change</span>
          </div>
          <div className={styles.divider} />
        </div>

        <div className={styles.actionItem} onClick={() => handleAction('split')}>
          <div className={styles.actionContent}>
            <span className={styles.actionIcon}>📶</span>
            <span className={styles.actionText}>Riding with someone?</span>
            <span className={styles.actionLink}>Split fare</span>
          </div>
          <div className={styles.divider} />
        </div>

        <div className={styles.actionItem} onClick={() => handleAction('share')}>
          <div className={styles.actionContent}>
            <span className={styles.actionIcon}>👤</span>
            <span className={styles.actionText}>Share trips status</span>
            <span className={styles.actionLink}>Share</span>
          </div>
          <div className={styles.divider} />
        </div>

        <button className={styles.cancelButton} onClick={handleCancel}>
          <span className={styles.cancelText}>Cancel</span>
        </button>

        {/* NEW: Complete the booking flow by confirming match (uses multi-trip state) */}
        <button
          onClick={() => {
            const tripId = activeTrip?.id;
            if (tripId) {
              updateTripStatus(tripId, 'in-progress', { driver: 'Li Ming', eta: '4 min' });
            } else {
              // Fallback: create one if somehow reached here without prior book
              bookTrip({ status: 'in-progress', from: '51 Sharon St', to: 'Apple Union Square', driver: 'Li Ming', vehicle: 'GodyX', eta: '4 min', price: 15 });
            }
            _addRecentAction('Driver matched — ride confirmed');
            success('司机已接单', '正在前往上车点');
            onNavigate?.('trip-pickup-countdown');
          }}
          style={{
            marginTop: 10, width: '100%', padding: '11px 0', background: '#0A0908', color: '#fecc2a',
            border: '1px solid #fecc2a', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}
        >
          ✓ 模拟司机接单 (Driver matched)
        </button>
      </div>

      <p className={styles.promoInfo}>Visa local offers for Sep 19 - 25</p>
      <p className={styles.promoDetail}>Get Gody Cash buy using your Visa card around town</p>

      <div style={{ display: 'flex', marginTop: 95, padding: '21px 121px 8px 120px' }}>
        <div style={{ borderRadius: 100, background: '#49493d', width: 134, height: 5 }} />
      </div>

      <HomeIndicator />

      {/* Cancel confirmation modal (replaces native confirm) */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="取消行程请求"
        destructive
        confirmText="确认取消"
        onConfirm={confirmCancel}
      >
        <p style={{ margin: 0, fontSize: 14, color: '#C9C6BE' }}>
          确定要取消当前行程请求吗？此操作无法撤销。
        </p>
      </Modal>
    </div>
  );
};

export default RequestingPage;
