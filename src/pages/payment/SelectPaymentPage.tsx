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
      : { id: 'gody-cash', type: 'gody' as const, label: 'Gody 现金', last4: undefined };
    setSelectedPayment(method);
    addRecentAction(`已选择支付方式：${method.label}`);
  };

  const usePayment = () => {
    onNavigate?.('payment-confirm');
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div className={styles.container}>
        <TopNav title="选择支付" onBack={() => onNavigate?.('core-home')} />

        <div className={styles.sectionTitle}>支付方式</div>

        {/* Gody Cash */}
        <div
          className={`${styles.option} ${!isVisaSelected ? styles.selected : ''}`}
          onClick={() => selectMethod('gody')}
        >
          <div className={styles.godyBadge}>Gody</div>
          <span style={{ marginLeft: 12, fontWeight: 500 }}>Gody 现金</span>
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
          在旧金山都市区与 Gody 拼车出行时，所有路线最高可省 15%。
        </div>

        <div className={styles.promoTitle}>优惠码</div>
        <div className={styles.addCard} onClick={() => info('促销', '添加促销码 (demo)')}>
          + Add promo codes
        </div>

        <button className={styles.useBtn} onClick={usePayment}>
          使用此支付方式
        </button>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default SelectPaymentPage;
