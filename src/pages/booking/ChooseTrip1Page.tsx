import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './ChooseTrip1Page.module.css';

interface ChooseTrip1PageProps {
  onNavigate?: (pageId: string) => void;
}

const ChooseTrip1Page: React.FC<ChooseTrip1PageProps> = ({ onNavigate }) => {
  const { addRecentAction } = useDemoState();
  const { info } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string, name: string, _price: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    setSelectedId(id);
    addRecentAction(`Chose trip option: ${name}`);
    // Visual feedback then navigate (matching original timeout behavior)
    setTimeout(() => {
      if (name === 'GodyX') {
        onNavigate?.('booking-confirm-godyx');
      } else {
        onNavigate?.('booking-confirm-pickup1');
      }
    }, 280);
  };

  const handleSeeAllEconomy = () => {
    info('车辆', '查看所有经济型车辆 (demo)');
  };

  const handleSeeAllPremium = () => {
    info('车辆', '查看所有高级型车辆 (demo)');
  };

  const handlePayment = () => {
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

  return (
    <div className="mobile-frame">
      <StatusBar />

      {/* 顶部导航 */}
      <div className={styles.topNav}>
        <div className={styles.navContent}>
          <span className={styles.backArrow} onClick={() => onNavigate?.('booking-choose-car')} role="button" aria-label="返回">←</span>
          <span className={styles.navTitle}>Choose a trip</span>
        </div>
        <span className={styles.navSubtitle}>Economy</span>
      </div>

      {/* See all 链接 */}
      <span className={styles.seeAll} onClick={handleSeeAllEconomy}>See all</span>

      {/* 经济型车辆 */}
      <div className={styles.economySection}>
        {/* GodyX 卡片 */}
        <div
          className={`${styles.vehicleCard} ${selectedId === 'godyx1' ? styles.selected : ''}`}
          onClick={() => handleSelect('godyx1', 'GodyX', 22.00)}
        >
          <div className={styles.vehicleImage}>🚗</div>
          <span className={styles.vehicleName}>GodyX</span>
          <div className={styles.vehicleInfo}>
            <div className={styles.seatsInfo}>
              <span className={styles.infoIcon}>👤</span>
              <span className={styles.infoText}>4</span>
            </div>
            <div className={styles.timeInfo}>
              <span className={styles.infoIcon}>🕐</span>
              <span className={styles.infoText}>1-4 min</span>
            </div>
          </div>
          <span className={styles.vehicleDescription}>Affordable rides, all to yourself</span>
          <span className={styles.vehiclePrice}>$22.00</span>
        </div>

        {/* Black SUV 卡片 */}
        <div
          className={`${styles.vehicleCard} ${selectedId === 'suv1' ? styles.selected : ''}`}
          onClick={() => handleSelect('suv1', 'Black SUV', 17.00)}
        >
          <div className={`${styles.vehicleImage} ${styles.vehicleImageSuv}`}>🚙</div>
          <span className={styles.vehicleName}>Black SUV</span>
          <div className={styles.vehicleInfo}>
            <div className={styles.seatsInfo}>
              <span className={styles.infoIcon}>👤</span>
              <span className={styles.infoText}>4</span>
            </div>
            <div className={styles.timeInfo}>
              <span className={styles.infoIcon}>🕐</span>
              <span className={styles.infoText}>1-8 min</span>
            </div>
          </div>
          <span className={styles.vehicleDescription}>Affordable rides, all to yourself</span>
          <span className={styles.vehiclePrice}>$17.00</span>
        </div>
      </div>

      {/* 高级型标题 */}
      <div className={styles.premiumSection}>
        <span className={styles.premiumTitle}>Premium</span>
        <span className={styles.seeAllPremium} onClick={handleSeeAllPremium}>See all</span>
      </div>

      {/* 高级型车辆 */}
      <div className={styles.premiumVehicles}>
        {/* Gody Black 卡片 */}
        <div
          className={`${styles.premiumCard} ${selectedId === 'godyblack1' ? styles.selected : ''}`}
          onClick={() => handleSelect('godyblack1', 'Gody Black', 12.00)}
        >
          <div className={styles.premiumVehicleImage}>
            <div className={`${styles.vehicleImage} ${styles.vehicleImageSuv}`}>🚙</div>
            <span className={styles.premiumVehicleName}>Gody Black</span>
          </div>
          <div className={styles.premiumInfo}>
            <div className={styles.seatsInfo}>
              <span className={styles.infoIcon}>👤</span>
              <span className={styles.infoText}>4</span>
            </div>
            <div className={styles.timeInfo}>
              <span className={styles.infoIcon}>🕐</span>
              <span className={styles.infoText}>1-7 min</span>
            </div>
          </div>
          <span className={styles.vehicleDescription}>Affordable rides, all to yourself</span>
          <span className={styles.vehiclePrice}>$12.00</span>
        </div>

        {/* Comfort XL 卡片 */}
        <div
          className={`${styles.comfortCard} ${selectedId === 'comfort1' ? styles.selected : ''}`}
          onClick={() => handleSelect('comfort1', 'Comfort XL', 24.00)}
        >
          <div className={styles.comfortImage}>🚗</div>
          <span className={styles.comfortName}>Comfort XL</span>
          <div className={styles.comfortInfo}>
            <div className={styles.seatsInfo}>
              <span className={styles.infoIcon}>👤</span>
              <span className={styles.infoText}>4</span>
            </div>
            <div className={styles.timeInfo}>
              <span className={styles.infoIcon}>🕐</span>
              <span className={styles.infoText}>1-8 min</span>
            </div>
          </div>
          <span className={styles.comfortDescription}>Affordable rides, all to yourself</span>
          <span className={styles.comfortPrice}>$24.00</span>
        </div>
      </div>

      {/* 支付方式 */}
      <div className={styles.paymentCard} onClick={handlePayment}>
        <div className={styles.visaLogo}>VISA</div>
        <div className={styles.cardInfo}>
          <span className={styles.cardDots}>....</span>
          <span className={styles.cardNumber}>1234</span>
        </div>
        <span className={styles.arrowIcon}>→</span>
      </div>

      {/* 底部指示器 */}
      <div className={styles.homeIndicator}>
        <div className={styles.indicator}></div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default ChooseTrip1Page;
