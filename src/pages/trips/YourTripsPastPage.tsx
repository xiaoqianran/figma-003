import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import TripCard from '../../components/mobile/TripCard';
import styles from './YourTripsPastPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const YourTripsPastPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, setActiveTrip, addRecentAction, updateTripStatus } = useDemoState();
  const goBack = () => onNavigate?.('trips-hub');
  const switchToUpcoming = () => {
    addRecentAction('Switched to upcoming trips view');
    onNavigate?.('trips-upcoming');
  };

  // NEW: render past list from bookedTrips (status completed) + activeTrip fallback for demo continuity
  const pastFromBooked = bookedTrips.filter(t => t.status === 'completed');
  const fallbackPast = (activeTrip && activeTrip.status === 'completed' && !pastFromBooked.some(t => t.id === activeTrip.id)) ? [activeTrip] : [];
  const pastTrips = [...pastFromBooked, ...fallbackPast];

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
            <span className={styles.title}>我的行程</span>
          </div>
          <div className={styles.filterBtn} onClick={switchToUpcoming}>
            <span>历史</span> <span>▼</span>
          </div>
        </div>

        {/* Live demo state hint */}
        {activeTrip && (
          <div style={{ margin: '0 16px 12px', padding: '8px 12px', background: '#fff8e1', borderRadius: 8, fontSize: 12, color: '#49493d', border: '1px solid #fecc2a' }}>
            Live: Active trip to <strong>{activeTrip.to}</strong> ({activeTrip.status}) — <span onClick={viewActiveIfAny} style={{ color: '#fecc2a', cursor: 'pointer', textDecoration: 'underline' }}>view in upcoming</span>
          </div>
        )}

        {/* Dynamic past trips list sourced from bookedTrips (completed) + fallback */}
        {pastTrips.length > 0 && (
          <div style={{ padding: '0 8px', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#6E6A61', margin: '0 16px 4px', textAlign: 'center' }}>
              Your booked past trips ({pastTrips.length}) — tap to view detail
            </div>
            {pastTrips.map((trip, idx) => (
              <TripCard
                key={trip.id || idx}
                status="completed"
                title={`${trip.vehicle || 'Ride'} to ${trip.to}`}
                time={`${trip.eta || '今天'} · ${trip.from || ''} → ${trip.to}`}
                from={trip.from || '上车点'}
                to={trip.to}
                price={trip.price ? String(trip.price) : undefined}
                driver={trip.driver}
                onClick={() => {
                  setActiveTrip(trip);
                  addRecentAction(`Viewed past trip ${trip.to} from dynamic list`);
                  onNavigate?.('trips-detail-completed');
                }}
              />
            ))}
            {/* Small action: allow re-completing a past one for demo */}
            {pastTrips[0] && (
              <button onClick={() => {
                const t = pastTrips[0];
                if (t.id) updateTripStatus(t.id, 'completed', { paid: true });
                addRecentAction('Re-confirmed past trip paid via update');
              }} style={{ margin: '4px 16px', fontSize: 10, padding: '2px 8px', background: '#e8f5e9', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Mark paid (demo)</button>
            )}
          </div>
        )}

        {/* Completed trip card (visual fixture, data-enhanced from first pastTrip or active for demo continuity) */}
        <div className={styles.tripCard} onClick={() => {
          const t = pastTrips[0] || activeTrip;
          if (t) setActiveTrip(t);
          openDetail('completed');
        }}>
          <div className={styles.tripTime}>Today, 3:45 pm&nbsp;</div>
          <div className={styles.tripPrice}>${(pastTrips[0]?.price || activeTrip?.price || 17)}.00</div>
        </div>
        <div className={styles.vehicleRow}>
          <div className={styles.vehicleInfo}>{(pastTrips[0]?.vehicle || activeTrip?.vehicle || '丰田凯美瑞')} - 9HTR789{pastTrips[0]?.driver ? ` · ${pastTrips[0].driver}` : ''}</div>
          <div className={styles.stars}>{Array.from({length:5}).map((_,i)=><span key={i} className={styles.star}>★</span>)}</div>
        </div>

        <div className={styles.mapArea}>
          <div className={styles.mapGrid} />
          <div style={{position:'absolute',top:23,left:122,width:112,height:106,border:'3px solid #fecc2a',borderRadius:50,transform:'rotate(61deg)',opacity:0.65}} />
          <div style={{position:'absolute',top:111,left:181,fontSize:18}}>📍</div>
        </div>

        {/* Cancelled trip (visual fixture; cancelled use completed status in state per API) */}
        <div className={styles.tripCard} onClick={() => {
          // For cancelled fixture, nav to its detail; if a completed in state, prefer completed detail
          if (pastTrips.length > 0) {
            setActiveTrip(pastTrips[0]);
            onNavigate?.('trips-detail-completed');
          } else {
            openDetail('cancelled');
          }
        }} style={{marginTop:16}}>
          <div className={styles.tripTime}>Today, 3:41 pm&nbsp;</div>
          <div className={styles.tripPrice}>$0.00</div>
        </div>
        <div className={styles.canceled}>已取消</div>

        <div className={styles.mapArea} style={{marginTop:16}}>
          <div className={styles.mapGrid} />
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default YourTripsPastPage;
