import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './YourTripsPastPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const YourTripsPastPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction } = useDemoState();
  const goBack = () => onNavigate?.('trips-hub');
  const switchToUpcoming = () => {
    addRecentAction('Switched to upcoming trips view');
    onNavigate?.('trips-upcoming');
  };

  const openDetail = (variant: 'completed' | 'cancelled') => {
    addRecentAction(`Viewed past trip (${variant})`);
    if (variant === 'completed') onNavigate?.('trips-detail-completed');
    else onNavigate?.('trips-detail-cancelled');
  };

  const viewActiveIfAny = () => {
    if (activeTrip) {
      addRecentAction('Viewed active trip from past page');
      onNavigate?.(activeTrip.status === 'completed' ? 'trips-detail-completed' : 'trip-upcoming');
    } else {
      onNavigate?.('trips-upcoming');
    }
  };

  return (
    <div className="mobile-frame" style={{ background: '#fff' }}>
      <StatusBar />

      <div className={styles.container}>
        <div className={styles.titleBar}>
          <div className={styles.backGroup}>
            <span className={styles.backIcon} onClick={goBack}>←</span>
            <span className={styles.title}>Your trips</span>
          </div>
          <div className={styles.filterBtn} onClick={switchToUpcoming}>
            <span>Past</span> <span>▼</span>
          </div>
        </div>

        {/* Live demo state hint */}
        {activeTrip && (
          <div style={{ margin: '0 16px 12px', padding: '8px 12px', background: '#fff8e1', borderRadius: 8, fontSize: 12, color: '#49493d', border: '1px solid #fecc2a' }}>
            Live: Active trip to <strong>{activeTrip.to}</strong> ({activeTrip.status}) — <span onClick={viewActiveIfAny} style={{ color: '#fecc2a', cursor: 'pointer', textDecoration: 'underline' }}>view in upcoming</span>
          </div>
        )}

        {/* Completed trip card */}
        <div className={styles.tripCard} onClick={() => openDetail('completed')}>
          <div className={styles.tripTime}>Today, 3:45 pm&nbsp;</div>
          <div className={styles.tripPrice}>$17.00</div>
        </div>
        <div className={styles.vehicleRow}>
          <div className={styles.vehicleInfo}>Toyota Camry - 9HTR789</div>
          <div className={styles.stars}>{Array.from({length:5}).map((_,i)=><span key={i} className={styles.star}>★</span>)}</div>
        </div>

        <div className={styles.mapArea}>
          <div className={styles.mapGrid} />
          <div style={{position:'absolute',top:23,left:122,width:112,height:106,border:'3px solid #fecc2a',borderRadius:50,transform:'rotate(61deg)',opacity:0.65}} />
          <div style={{position:'absolute',top:111,left:181,fontSize:18}}>📍</div>
        </div>

        {/* Cancelled trip */}
        <div className={styles.tripCard} onClick={() => openDetail('cancelled')} style={{marginTop:16}}>
          <div className={styles.tripTime}>Today, 3:41 pm&nbsp;</div>
          <div className={styles.tripPrice}>$0.00</div>
        </div>
        <div className={styles.canceled}>Canceled</div>

        <div className={styles.mapArea} style={{marginTop:16}}>
          <div className={styles.mapGrid} />
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default YourTripsPastPage;
