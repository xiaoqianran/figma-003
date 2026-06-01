import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './MapHomePage.module.css';

interface MapHomePageProps {
  onNavigate?: (pageId: string) => void;
}

const MapHomePage: React.FC<MapHomePageProps> = ({ onNavigate }) => {
  const { info, success } = useToast();
  const { user, activeTrip, addRecentAction, placeEatsOrder, bookTrip } = useDemoState();

  const selectCar = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.transform = 'scale(1.6)';
    addRecentAction('Selected car on map home');
    setTimeout(() => onNavigate?.('booking-choose-car'), 280);
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(45deg,#ff6b6b,#4ecdc4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍💼</div>
        <div style={{ marginLeft: 14, fontSize: 16, fontWeight: 500 }}>Good morning, {user.name.split(' ')[0]}</div>
        <div style={{ marginLeft: 'auto', fontSize: 22, cursor: 'pointer' }} onClick={() => { addRecentAction('Opened profile from map home'); onNavigate?.('account-profile'); }}>☰</div>
      </div>

      {/* Current trip hint from DemoState */}
      {activeTrip && (
        <div onClick={() => { addRecentAction('Tapped current trip hint on map'); onNavigate?.('trip-upcoming'); }} style={{ margin: '8px 16px 0', background: '#fff8e1', border: '1px solid #fecc2a', borderRadius: 10, padding: '8px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🚗</span>
          <span>Active: <strong>{activeTrip.to}</strong> ({activeTrip.status}) — tap for details</span>
        </div>
      )}

      <div className={styles.mapArea}>
        <div className={styles.mapGrid} />
        <div className={styles.car} style={{ top: 105, left: 51 }} onClick={selectCar}>🚕</div>
        <div className={styles.car} style={{ top: 171, left: 236, transform: 'rotate(-47deg)' }} onClick={selectCar}>🚕</div>
        <div className={styles.car} style={{ top: 257, left: 212 }} onClick={selectCar}>🚕</div>
        <div className={styles.car} style={{ top: 240, left: 348, transform: 'rotate(90deg)' }} onClick={selectCar}>🚕</div>

        <div className={styles.locationBtn} onClick={() => { addRecentAction('Used locate on map home'); info('定位', '定位成功 (demo)'); }}>🎯</div>
      </div>

      <div className={styles.bottomPanel}>
        <div className={styles.searchBox} onClick={() => { addRecentAction('Opened search from map'); onNavigate?.('core-search1'); }}>
          🔍 <span style={{ marginLeft: 8, color: '#959595' }}>Search your location</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); addRecentAction('Schedule from map'); onNavigate?.('booking-schedule'); }}>Schedule</span>
        </div>

        <div style={{ marginTop: 22 }}>
          <div onClick={() => { addRecentAction('Viewed saved places'); info('地点', 'Saved places (demo)'); }} style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}>⭐ <span style={{ marginLeft: 8 }}>Saved places</span></div>
          <div style={{ height: 1, background: '#f3f3f3', margin: '6px 0 12px' }} />
          <div onClick={() => { addRecentAction('Set location on map'); info('地图', 'Set location on map (demo)'); }} style={{ display: 'flex', alignItems: 'center' }}>📍 <span style={{ marginLeft: 8 }}>Set location on map</span></div>
        </div>

        <div className={styles.actionRow}>
          <div className={`${styles.actionBtn} ${styles.tripsBtn}`} onClick={() => { addRecentAction('Opened trips from map home'); onNavigate?.('trips-hub'); }}>🚗 Trips</div>
          <div className={`${styles.actionBtn} ${styles.eatsBtn}`} onClick={() => {
            addRecentAction('Opened eats demo');
            placeEatsOrder('Map QuickBite', 'Street Bao', 18);
            bookTrip({ from: 'Map QuickBite', to: 'Current location', driver: 'Rider', vehicle: 'Bike', price: 18, status: 'upcoming', eta: '12 min' });
            success('Eats', 'Order placed! ¥18 Bao • Delivery trip logged in DemoState');
          }}>🍽️ Eats</div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default MapHomePage;
