import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './TripDetailCancelledPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripDetailCancelledPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, setActiveTrip, addRecentAction, updateTripStatus, cancelTrip, completeTrip } = useDemoState();
  const goBack = () => onNavigate?.('trips-past');

  const goToPast = () => {
    addRecentAction('Returned to past trips from cancelled detail');
    onNavigate?.('trips-past');
  };

  // NEW: functional buttons using mutation APIs even on cancelled view (for demo, allows status changes + ensures appears in past)
  const handleUndoCancel = () => {
    const id = activeTrip?.id;
    addRecentAction('Undo cancel via updateTripStatus (set upcoming)');
    if (id) {
      updateTripStatus(id, 'upcoming', { eta: 'Rescheduled' });
    } else {
      // create a demo one if none
      // but avoid book here; just toast
    }
    onNavigate?.('trips-upcoming');
  };

  const handleCompleteFromCancelled = () => {
    const id = activeTrip?.id;
    addRecentAction('Force complete from cancelled detail via completeTrip');
    if (id) completeTrip(id);
    onNavigate?.('trips-past');
  };

  const handleCancelAgain = () => {
    const id = activeTrip?.id;
    if (id) cancelTrip(id);
    addRecentAction('Re-cancel via cancelTrip API');
    onNavigate?.('trips-past');
  };

  React.useEffect(() => {
    addRecentAction('Viewed cancelled trip detail');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mobile-frame" style={{ background: '#fff' }}>
      <StatusBar />

      <div className={styles.container}>
        {/* 标题栏 */}
        <div className={styles.titleBar}>
          <div className={styles.backGroup}>
            <span className={styles.backIcon} onClick={goBack}>←</span>
            <span className={styles.title}>Your trips</span>
          </div>
          <div className={styles.filterBtn} onClick={goToPast}>
            <span>Past</span>
            <span>▼</span>
          </div>
        </div>

        {activeTrip && (
          <div style={{ margin: '8px 16px', fontSize: 11, color: '#6E6A61', background: '#f8f8f5', padding: '6px 10px', borderRadius: 6 }}>
            Demo active: {activeTrip.from} → {activeTrip.to} ({activeTrip.status})
          </div>
        )}

        {/* 第一条行程 - uses active if matches */}
        <div className={styles.tripRow}>
          <div className={styles.tripTime}>Today, 3:45 pm&nbsp;</div>
          <div className={styles.tripPrice}>${activeTrip?.price || 17}.00</div>
        </div>

        <div className={styles.vehicleRow}>
          <div className={styles.vehicleInfo}>{activeTrip?.vehicle || 'Toyota Camry'} - 9HTR789</div>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => <span key={i} className={styles.star}>★</span>)}
          </div>
        </div>

        {/* 地图1 */}
        <div className={styles.mapArea}>
          <div className={styles.mapGrid} />
          <div className={styles.pathLine} />
          <div className={styles.pin}>📍</div>
        </div>

        {/* 第二条 (取消的) */}
        <div className={styles.tripRow} style={{ marginTop: 16 }}>
          <div className={styles.tripTime}>Today, 3:41 pm&nbsp;</div>
          <div className={styles.tripPrice}>$0.00</div>
        </div>
        <div className={styles.canceledLabel}>Canceled</div>

        {/* 地图2 */}
        <div className={styles.secondaryMap}>
          <div className={styles.mapGrid} />
        </div>

        {/* NEW functional Cancel/Complete mutation buttons (and undo) in cancelled detail */}
        <div style={{ padding: '12px 24px 8px', fontSize: 12 }}>
          <div style={{ color: '#959595', marginBottom: 6 }}>Demo trip actions (use APIs, trip will move to Past lists on complete/cancel):</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleUndoCancel} style={{ flex:1, padding:'8px 12px', background:'#e8f5e9', border:'none', borderRadius:8, fontSize:12, cursor:'pointer' }}>Undo Cancel → Upcoming</button>
            <button onClick={handleCompleteFromCancelled} style={{ flex:1, padding:'8px 12px', background:'#e3f2fd', border:'none', borderRadius:8, fontSize:12, cursor:'pointer' }}>Mark Complete</button>
            <button onClick={handleCancelAgain} style={{ flex:1, padding:'8px 12px', background:'#ffebee', border:'none', borderRadius:8, fontSize:12, cursor:'pointer', color:'#c62828' }}>Re-cancel</button>
          </div>
          {activeTrip && <div style={{ marginTop: 4, fontSize: 10, color: '#6E6A61' }}>Using: {activeTrip.from}→{activeTrip.to} ({activeTrip.status}) | booked:{bookedTrips.length}</div>}
          {/* Quick focus other booked completed for past continuity */}
          {bookedTrips.filter(t => t.status === 'completed').length > 0 && (
            <button onClick={() => {
              const pastOne = bookedTrips.find(t => t.status === 'completed');
              if (pastOne) { setActiveTrip(pastOne); onNavigate?.('trips-detail-completed'); }
            }} style={{ marginTop: 6, fontSize: 10, padding: '4px 8px', background: '#f5f5f5', border: 'none', borderRadius: 4 }}>View a completed past trip →</button>
          )}
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default TripDetailCancelledPage;
