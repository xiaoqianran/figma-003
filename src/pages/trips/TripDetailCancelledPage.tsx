import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './TripDetailCancelledPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripDetailCancelledPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction } = useDemoState();
  const goBack = () => onNavigate?.('trips-past');

  const goToPast = () => {
    addRecentAction('Returned to past trips from cancelled detail');
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

        <HomeIndicator />
      </div>
    </div>
  );
};

export default TripDetailCancelledPage;
