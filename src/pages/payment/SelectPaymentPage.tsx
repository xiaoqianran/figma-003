import React from 'react';
import { StatusBar, TopNav, HomeIndicator } from '../../components/mobile';
import styles from './SelectPaymentPage.module.css';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';

interface SelectPaymentPageProps {
  onNavigate?: (pageId: string) => void;
}

const SelectPaymentPage: React.FC<SelectPaymentPageProps> = ({ onNavigate }) => {
  const { selectedPayment, setSelectedPayment, addRecentAction } = useDemoState();
  const { info } = useToast();

  const isVisaSelected = selectedPayment.type === 'visa' || selectedPayment.id.includes('visa');
  const selectMethod = (type: 'visa' | 'gody') => {
    const method = type === 'visa'
      ? { id: 'visa-4242', type: 'visa' as const, label: 'Visa •••• 4242', last4: '4242' }
      : { id: 'gody-cash', type: 'gody' as const, label: 'Gody Cash', last4: undefined };
    setSelectedPayment(method);
    addRecentAction(`Selected payment: ${method.label}`);
  };

  const usePayment = () => {
    onNavigate?.('payment-confirm');
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div className={styles.container}>
        <TopNav title="Select payment" onBack={() => onNavigate?.('core-home')} />

        <div className={styles.sectionTitle}>Payment methods</div>

        {/* Gody Cash */}
        <div
          className={`${styles.option} ${!isVisaSelected ? styles.selected : ''}`}
          onClick={() => selectMethod('gody')}
        >
          <div className={styles.godyBadge}>Gody</div>
          <span style={{ marginLeft: 12, fontWeight: 500 }}>Gody Cash</span>
        </div>

        {/* VISA */}
        <div
          className={`${styles.option} ${isVisaSelected ? styles.selected : ''}`}
          onClick={() => selectMethod('visa')}
        >
          <div className={styles.visaLogo}>VISA</div>
          <div style={{ marginLeft: 12 }}>
            <div style={{ fontWeight: 700 }}>.... 4242</div>
          </div>
          {isVisaSelected && <span className={styles.check}>✓</span>}
        </div>

        <div className={styles.addCard} onClick={() => info('支付', '添加支付方式 (demo)')}>
          + Add Payment methods
        </div>

        <div className={styles.discount}>
          Save up to 15% on all routes when you ride with Gody and Pool in the San Francisco metropolitan area.
        </div>

        <div className={styles.promoTitle}>Promo codes</div>
        <div className={styles.addCard} onClick={() => info('促销', '添加促销码 (demo)')}>
          + Add promo codes
        </div>

        <button className={styles.useBtn} onClick={usePayment}>
          Use payment method
        </button>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default SelectPaymentPage;
