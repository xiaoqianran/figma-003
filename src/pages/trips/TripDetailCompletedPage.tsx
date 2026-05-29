import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast } from '../../components/ui';
import styles from './TripDetailCompletedPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripDetailCompletedPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction } = useDemoState();
  const { info } = useToast();
  const goBack = () => onNavigate?.('trips-past');

  const handleHelp = () => {
    addRecentAction('Requested help from completed trip detail');
    onNavigate?.('trips-detail-help');
  };

  const handlePayment = () => {
    addRecentAction('Switched payment from trip detail');
    info('支付', '打开支付方式编辑页面 (demo)');
    onNavigate?.('payment-select');
  };

  const handleRate = () => {
    addRecentAction('Opened rating for completed trip');
    onNavigate?.('other-evaluate1');
  };

  // Log view naturally on render (demo only)
  React.useEffect(() => {
    addRecentAction('Viewed completed trip detail');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mobile-frame" style={{ background: '#fff' }}>
      <StatusBar />

      <div className={styles.container}>
        <div className={styles.titleBar}>
          <span className={styles.backIcon} onClick={goBack}>←</span>
          <span className={styles.title}>Trips detail</span>
        </div>

        {/* Map */}
        <div className={styles.mapArea}>
          <div className={styles.mapGrid} />
          <div style={{ position: 'absolute', top: 23, left: 120, width: 112, height: 106, border: '3px solid #4ecdc4', borderRadius: 50, transform: 'rotate(61deg)', opacity: 0.65 }} />
          <div style={{ position: 'absolute', top: 111, left: 180, fontSize: 18 }}>📍</div>
        </div>

        <div className={styles.tripRow}>
          <div className={styles.tripTime}>Today, 3:45 pm&nbsp;</div>
          <div className={styles.tripPrice}>${activeTrip?.price || 17}.00</div>
        </div>
        <div className={styles.vehicleInfo}>{activeTrip?.vehicle || 'Toyota Camry'} - 9HTR789{activeTrip?.driver ? ` · ${activeTrip.driver}` : ''}</div>

        {/* Locations */}
        <div className={styles.locationSection}>
          <div className={styles.locationIcons}>
            <div className={styles.hereDot}><div className={styles.hereDotInner} /></div>
            <div className={styles.locationLine} />
            <div className={styles.locationPin}>📍</div>
          </div>
          <div className={styles.locationInputs}>
            <div className={styles.locInput}>{activeTrip?.to || 'Apple Union Square'}</div>
            <div className={styles.locInput}>{activeTrip?.from || 'San Francisco International Airport'}</div>
          </div>
        </div>

        {/* Rating */}
        <div className={styles.ratingRow}>
          <div className={styles.avatar}>👤</div>
          <div className={styles.ratingLabel}>You rated Push</div>
          <div className={styles.ratingStars}>
            {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: '#fecc2a', fontSize: 16 }}>★</span>)}
          </div>
        </div>

        <div className={styles.helpLink} onClick={handleHelp}>Need help with this trip?</div>

        {/* Action cards */}
        <div className={styles.actionRow}>
          <div className={styles.actionCard} onClick={handlePayment}>
            <div className={styles.actionTitle}>Switch payment method</div>
            <div className={styles.actionDesc}>I want to switch my payment method for this trip.</div>
            <div className={styles.actionLink}>Edit payment</div>
          </div>
          <div className={styles.actionCard} onClick={handleRate}>
            <div className={styles.actionTitle}>Rate your trip</div>
            <div className={styles.actionDesc}>Share your experience with the driver.</div>
            <div className={styles.actionLink}>Rate now →</div>
          </div>
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default TripDetailCompletedPage;
