import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './ConfirmGodyxPage.module.css';

interface ConfirmGodyxPageProps {
  onNavigate?: (pageId: string) => void;
}

const ConfirmGodyxPage: React.FC<ConfirmGodyxPageProps> = ({ onNavigate }) => {
  const { addRecentAction } = useDemoState();
  const [confirming, setConfirming] = useState(false);

  const handleBack = () => {
    addRecentAction('Back from confirm GodyX');
    onNavigate?.('booking-choose-trip1');
  };

  const handlePayment = () => {
    addRecentAction('Change payment from GodyX confirm');
    const card = document.querySelector(`.${styles.paymentCard}`) as HTMLElement;
    if (card) {
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (card) card.style.transform = 'scale(1)';
        onNavigate?.('payment-select');
      }, 140);
    } else {
      onNavigate?.('payment-select');
    }
  };

  const handleConfirm = () => {
    setConfirming(true);
    addRecentAction('Confirmed GodyX premium');
    const btn = document.querySelector(`.${styles.confirmButton}`) as HTMLElement;
    if (btn) {
      btn.style.transform = 'scale(0.95)';
    }

    setTimeout(() => {
      setConfirming(false);
      if (btn) {
        btn.style.transform = 'scale(1)';
      }
      onNavigate?.('booking-requesting');
    }, 1450);
  };

  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden' }}>
      {/* 地图背景 */}
      <div className={styles.mapBackground}>
        <div className={styles.mapPath}></div>
      </div>

      <StatusBar dark />

      {/* 返回按钮 */}
      <div className={styles.navArea}>
        <span className={styles.backArrow} onClick={handleBack} role="button" aria-label="返回">←</span>
      </div>

      {/* 遮罩层 */}
      <div className={styles.overlay}></div>

      {/* 底部确认卡片 */}
      <div className={styles.confirmCard}>
        {/* 车辆信息卡片 */}
        <div className={styles.vehicleInfoCard}>
          <div className={styles.vehicleBasicInfo}>
            <div className={styles.vehicleHeader}>
              <p className={styles.vehicleName}>GodyX</p>
              <div className={styles.ratingSection}>
                <span className={styles.starIcon}>⭐</span>
                <p className={styles.ratingText}>4</p>
              </div>
            </div>
            <p className={styles.vehicleDetails}>4:04pm drop-off</p>
            <p className={styles.vehicleDescription}>Affordable rides, all to yourself</p>
          </div>
          <p className={styles.priceInfo}>$17.00</p>
        </div>

        {/* 车辆图片 */}
        <div className={styles.vehicleImageSection}>
          <div className={styles.vehicleImagePlaceholder}>🚗</div>
        </div>

        {/* 支付方式卡片 */}
        <div className={styles.paymentCard} onClick={handlePayment}>
          <div className={styles.visaLogo}>VISA</div>
          <div className={styles.cardInfo}>
            <p className={styles.cardDots}>....</p>
            <p className={styles.cardNumber}>6789</p>
          </div>
          <span className={styles.arrowIcon}>→</span>
        </div>

        {/* 确认按钮 */}
        <div className={styles.confirmButton} onClick={handleConfirm}>
          <p className={styles.confirmText}>{confirming ? '确认中...' : 'Confirm GodyX'}</p>
        </div>

        {/* 底部指示器 */}
        <div className={styles.homeIndicator}>
          <div className={styles.indicator}></div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default ConfirmGodyxPage;
