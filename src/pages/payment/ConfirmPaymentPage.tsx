import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import styles from './ConfirmPaymentPage.module.css';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';

interface ConfirmPaymentPageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmPaymentPage: React.FC<ConfirmPaymentPageProps> = ({ onNavigate }) => {
  const { selectedPayment, activeTrip, addRecentAction, updateTripStatus, bookTrip } = useDemoState();
  const { success } = useToast();

  const confirm = () => {
    addRecentAction(`已使用 ${selectedPayment.label} 确认行程支付`);
    if (activeTrip) {
      // Use new state API: mark paid + in-progress
      updateTripStatus(activeTrip.id, 'in-progress', { paid: true });
    } else {
      // Allow standalone payment confirm to seed a demo trip (robustness)
      bookTrip({ status: 'in-progress', from: '演示上车点', to: '演示下车点', price: 18, paid: true, vehicle: 'GodyX' });
    }
    success('支付成功', '支付确认成功！行程已预订 (multi-trip state + paid flag)');
    onNavigate?.('trips-upcoming');
  };

  return (
    <div className="mobile-frame">
      <div className={styles.container}>
        <StatusBar />

        <div className={styles.mapArea}>
          <div className={styles.mapGrid} />

          <div className={styles.header}>
            <div onClick={() => onNavigate?.('payment-select')} style={{ fontSize: 22, cursor: 'pointer' }}>←</div>
            <div className={styles.helpBtn}>帮助</div>
          </div>

          <div className={styles.confirmCard}>
            <div style={{ fontWeight: 500, fontSize: 16 }}>确认价格</div>
            <div className={styles.price}>预付 $3.00 锁定</div>
            <div style={{ fontSize: 13, color: '#49493d' }}>与 Gody 及拼车在旧金山都会区出行时，全线路最高可省 15%。</div>

            <div className={styles.paymentRow} onClick={() => onNavigate?.('payment-select')}>
              {selectedPayment.type === 'visa' ? (
                <div style={{ background: 'linear-gradient(45deg,#1a1f71,#0066cc)', color: '#fff', padding: '2px 8px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>VISA</div>
              ) : (
                <div style={{ background: '#fecc2a', color: '#0A0908', padding: '2px 8px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>GODY</div>
              )}
              <div style={{ marginLeft: 12, fontWeight: 700 }}>{selectedPayment.label}</div>
              <div style={{ marginLeft: 'auto', color: '#fecc2a', fontSize: 14 }}>更改</div>
            </div>

            <button className={styles.confirmBtn} onClick={confirm}>
              Confirm
            </button>
          </div>
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default ConfirmPaymentPage;
