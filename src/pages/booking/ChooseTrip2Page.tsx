import React, { useState, useEffect } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './ChooseTrip2Page.module.css';

interface ChooseTrip2PageProps {
  onNavigate?: (pageId: string) => void;
}

const ChooseTrip2Page: React.FC<ChooseTrip2PageProps> = ({ onNavigate }) => {
  const { addRecentAction } = useDemoState(); // activeTrip available for future prefill
  const { info } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>('godyx2'); // Pre-selected GodyX per original

  const handleSelect = (id: string, name: string, _price: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    setSelectedId(id);
    addRecentAction(`Chose trip variant 2: ${name}`);
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

  // Initialize default selection highlight
  useEffect(() => {
    // Already set in state
  }, []);

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div className={styles.topNav}>
        <div className={styles.navContent}>
          <span className={styles.backArrow} onClick={() => onNavigate?.('booking-choose-car')} role="button" aria-label="返回">←</span>
          <span className={styles.navTitle}>选择行程</span>
        </div>
        <span className={styles.navSubtitle}>经济</span>
      </div>

      <span className={styles.seeAll} onClick={handleSeeAllEconomy}>查看全部</span>

      <div className={styles.economySection}>
        <div
          className={`${styles.vehicleCard} ${selectedId === 'godyx2' ? styles.selected : ''}`}
          onClick={() => handleSelect('godyx2', 'GodyX', 22.00)}
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
          <span className={styles.vehicleDescription}>经济实惠，专车独享</span>
          <span className={styles.vehiclePrice}>$22.00</span>
        </div>

        <div
          className={`${styles.vehicleCard} ${selectedId === 'suv2' ? styles.selected : ''}`}
          onClick={() => handleSelect('suv2', '黑金 SUV', 17.00)}
        >
          <div className={`${styles.vehicleImage} ${styles.vehicleImageSuv}`}>🚙</div>
          <span className={styles.vehicleName}>黑金 SUV</span>
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
          <span className={styles.vehicleDescription}>经济实惠，专车独享</span>
          <span className={styles.vehiclePrice}>$17.00</span>
        </div>
      </div>

      <div className={styles.premiumSection}>
        <span className={styles.premiumTitle}>高端</span>
        <span className={styles.seeAllPremium} onClick={handleSeeAllPremium}>查看全部</span>
      </div>

      <div className={styles.premiumVehicles}>
        <div
          className={`${styles.premiumCard} ${selectedId === 'godyblack2' ? styles.selected : ''}`}
          onClick={() => handleSelect('godyblack2', 'Gody 黑金', 12.00)}
        >
          <div className={styles.premiumVehicleImage}>
            <div className={`${styles.vehicleImage} ${styles.vehicleImageSuv}`}>🚙</div>
            <span className={styles.premiumVehicleName}>Gody 黑金</span>
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
          <span className={styles.vehicleDescription}>经济实惠，专车独享</span>
          <span className={styles.vehiclePrice}>$12.00</span>
        </div>

        <div
          className={`${styles.comfortCard} ${selectedId === 'comfort2' ? styles.selected : ''}`}
          onClick={() => handleSelect('comfort2', '舒适加大', 24.00)}
        >
          <div className={styles.comfortImage}>🚗</div>
          <span className={styles.comfortName}>舒适加大</span>
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
          <span className={styles.comfortDescription}>经济实惠，专车独享</span>
          <span className={styles.comfortPrice}>$24.00</span>
        </div>
      </div>

      <div className={styles.paymentCard} onClick={handlePayment}>
        <div className={styles.visaLogo}>VISA</div>
        <div className={styles.cardInfo}>
          <span className={styles.cardDots}>....</span>
          <span className={styles.cardNumber}>1234</span>
        </div>
        <span className={styles.arrowIcon}>→</span>
      </div>

      <div className={styles.homeIndicator}>
        <div className={styles.indicator}></div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default ChooseTrip2Page;
