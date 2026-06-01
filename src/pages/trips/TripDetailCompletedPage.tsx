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
    addRecentAction('Requested help from completed trip detail');
    onNavigate?.('trips-detail-help');
  };

  const handlePayment = () => {
    addRecentAction('Switched payment from trip detail');
    if (activeTrip?.id) updateTripStatus(activeTrip.id, 'completed', { paid: true });
    info('支付', '打开支付方式编辑页面 (demo)');
    onNavigate?.('payment-select');
  };

  const handleRate = () => {
    addRecentAction('Opened rating for completed trip');
    // Enhanced: functional rate that ensures paid via mutation + toasts + nav
    if (activeTrip?.id) {
      updateTripStatus(activeTrip.id, 'completed', { paid: true });
    }
    success('感谢', '评价已提交 (via updateTripStatus demo)');
    onNavigate?.('other-evaluate1');
  };

  // NEW functional mutation buttons for detail page (Cancel/Complete/Rate via APIs)
  const handleCompleteAgain = () => {
    const id = activeTrip?.id;
    if (id) {
      completeTrip(id);
      addRecentAction('Re-completed via completeTrip API from detail');
      success('完成', 'Trip marked completed + paid via completeTrip');
    } else {
      info('Demo', 'No active trip id');
    }
  };

  const handleCancelFromDetail = () => {
    const id = activeTrip?.id;
    addRecentAction('Called cancelTrip from completed detail (demo)');
    if (id) {
      cancelTrip(id);
    }
    onNavigate?.('trips-past');
  };

  const handleMarkPaid = () => {
    const id = activeTrip?.id;
    if (id) {
      updateTripStatus(id, 'completed', { paid: true });
      addRecentAction('Marked paid via updateTripStatus');
      success('支付', 'Marked as paid');
    }
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

        {/* NEW: functional mutation action bar for Cancel / Complete / Rate (and paid) using DemoState APIs */}
        <div style={{ padding: '0 24px', marginTop: 16, marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: '#959595', marginBottom: 6 }}>Demo actions (update status via APIs):</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={handleMarkPaid} style={{ flex: 1, minWidth: 70, padding: '8px 10px', fontSize: 12, background: '#e3f2fd', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Mark Paid</button>
            <button onClick={handleCompleteAgain} style={{ flex: 1, minWidth: 70, padding: '8px 10px', fontSize: 12, background: '#e8f5e9', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Complete</button>
            <button onClick={handleCancelFromDetail} style={{ flex: 1, minWidth: 70, padding: '8px 10px', fontSize: 12, background: '#ffebee', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#c62828' }}>Cancel</button>
            <button onClick={() => { addRecentAction('Rate via action bar'); handleRate(); }} style={{ flex: 1, minWidth: 70, padding: '8px 10px', fontSize: 12, background: '#fff8e1', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Rate</button>
          </div>
          {activeTrip && <div style={{ fontSize: 10, marginTop: 4, color: '#6E6A61' }}>Active: {activeTrip.id} ({activeTrip.status}, paid:{String(!!activeTrip.paid)})</div>}
          {/* Also show count from booked for continuity */}
          {bookedTrips.length > 0 && <div style={{ fontSize: 10, color: '#959595' }}>Total booked in state: {bookedTrips.length}</div>}
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default TripDetailCompletedPage;
