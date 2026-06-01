import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { Modal } from '../../components/ui';
import styles from './RequestingPage.module.css';
import { useDemoState } from '../../context/DemoStateContext';

interface RequestingPageProps {
  onNavigate?: (pageId: string) => void;
}

const RequestingPage: React.FC<RequestingPageProps> = ({ onNavigate }) => {
  const { activeTrip, selectedPayment: _selectedPayment, addRecentAction, updateTripStatus, setActiveTrip, bookTrip } = useDemoState();
  const { success } = useToast();
  const [countdown, setCountdown] = useState({ min: 8, sec: 39 });
  const [showCancelModal, setShowCancelModal] = useState(false);

  // NEW states for realistic live driver pings simulation + state-aware countdown
  const [livePings, setLivePings] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [liveDriver, setLiveDriver] = useState<string | undefined>(undefined);
  const [liveEta, setLiveEta] = useState<string | undefined>(undefined);
  const [hasAutoMatched, setHasAutoMatched] = useState(false);

  const pingIntervalRef = useRef<number | null>(null);
  const matchTimeoutRef = useRef<number | null>(null);
  const triggerRef = useRef<((isManual: boolean) => void) | null>(null);

  // State-aware initialization: seed trip if needed, sync countdown from activeTrip.eta if present
  // (deferred setState to satisfy eslint react-hooks/set-state-in-effect)
  useEffect(() => {
    const init = () => {
      if (activeTrip?.eta) {
        const match = activeTrip.eta.match(/(\d+)/);
        if (match) {
          const mins = parseInt(match[1], 10);
          if (mins > 0 && mins < 40) {
            setCountdown({ min: mins, sec: Math.floor(Math.random() * 45) + 10 });
          }
        }
      }
      if (!activeTrip) {
        const seeded = bookTrip({
          status: 'upcoming',
          from: '51 Sharon St',
          to: 'Apple Union Square',
          price: 15,
          eta: '12 min',
          vehicle: 'GodyX'
        });
        addRecentAction(`Entered requesting — seeded upcoming trip (id: ${seeded.id})`);
      } else {
        addRecentAction('Entered requesting page (live driver match simulation active)');
      }
    };
    // Defer to next tick to avoid sync setState in effect
    const t = setTimeout(init, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realistic live driver pings simulation (every ~2.8s): uses updateTripStatus + addRecentAction
  // ETA decreases, driver names appear, progress bar + ping feed update, countdown syncs
  useEffect(() => {
    if (hasAutoMatched) return;

    const tripId = activeTrip?.id;
    const driverPool = ['Li Ming', 'Chen Fang', 'Zhao Lei', 'Wang Yu', 'Sun Hao'];

    let pingCount = 0;

    pingIntervalRef.current = window.setInterval(() => {
      pingCount += 1;
      const driver = driverPool[pingCount % driverPool.length];
      // Realistic approaching: ETA steadily decreases toward pickup
      const baseEta = Math.max(3, 13 - Math.floor(pingCount * 1.7));
      const etaStr = `${baseEta} min`;
      const vehicle = 'GodyX';

      if (tripId) {
        updateTripStatus(tripId, 'upcoming', { driver, eta: etaStr, vehicle });
      } else {
        bookTrip({
          status: 'upcoming',
          driver,
          eta: etaStr,
          vehicle,
          from: activeTrip?.from || '51 Sharon St',
          to: activeTrip?.to || 'Apple Union Square',
          price: activeTrip?.price || 15
        });
      }

      addRecentAction(`Live driver ping #${pingCount}: ${driver} en route • ETA ${etaStr}`);

      setLiveDriver(driver);
      setLiveEta(etaStr);

      // Make countdown state-aware: sync displayed pickup time to live ETA from pings
      setCountdown({ min: baseEta, sec: (59 - (pingCount % 35)) });

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const pingMsg = `🟢 ${driver} • ${etaStr} away • ${timeStr.slice(0, 8)}`;
      setLivePings(prev => [pingMsg, ...prev].slice(0, 4));

      // Visual progress feedback (realistic fill rate for requesting phase)
      setProgress(p => Math.min(92, Math.floor(p + 13 + Math.random() * 7)));
    }, 2800);

    // Built-in auto match timer (realistic ~14s demo window before 0 or manual)
    matchTimeoutRef.current = window.setTimeout(() => {
      triggerRef.current?.(false);
    }, 14200);

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      if (matchTimeoutRef.current) {
        clearTimeout(matchTimeoutRef.current);
        matchTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrip?.id, hasAutoMatched]);

  // Core match handler: transition to 'in-progress' using new APIs (updateTripStatus preferred), intelligent nav
  const triggerDriverMatch = useCallback((isManual: boolean) => {
    if (hasAutoMatched) return;
    setHasAutoMatched(true);

    // stop live sims immediately
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (matchTimeoutRef.current) {
      clearTimeout(matchTimeoutRef.current);
      matchTimeoutRef.current = null;
    }

    const tripId = activeTrip?.id;
    const driver = liveDriver || 'Li Ming';
    const eta = liveEta || '4 min';
    const vehicle = activeTrip?.vehicle || 'GodyX';
    const from = activeTrip?.from || '51 Sharon St';
    const to = activeTrip?.to || 'Apple Union Square';
    const price = activeTrip?.price || 15;

    if (tripId) {
      updateTripStatus(tripId, 'in-progress', { driver, eta, vehicle });
    } else {
      bookTrip({ status: 'in-progress', from, to, driver, vehicle, eta, price });
    }

    const action = isManual
      ? 'Driver matched — user tapped button (live pings + ETA updates active)'
      : 'Driver matched — built-in timer reached 0 or pings simulation complete';
    addRecentAction(action);
    success('司机已接单', `${driver} 正在前往上车点 · ETA ${eta}`);

    // Intelligent navigation to improved PickupCountdownPage (picks up live driver/eta from state)
    onNavigate?.('trip-pickup-countdown');
  }, [activeTrip, liveDriver, liveEta, hasAutoMatched, updateTripStatus, bookTrip, addRecentAction, success, onNavigate]);

  // Expose trigger via ref so timer/interval closures (and countdown 0) can call latest version
  useEffect(() => {
    triggerRef.current = triggerDriverMatch;
  }, [triggerDriverMatch]);

  // Improved realistic countdown: no artificial 5s cutoff. Now runs full + triggers on 0 (state-aware via pings sync too)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { min, sec } = prev;
        sec--;
        if (sec < 0) {
          sec = 59;
          min--;
        }
        if (min < 0) {
          clearInterval(timer);
          if (!hasAutoMatched) {
            triggerRef.current?.(false);
          }
          return { min: 0, sec: 0 };
        }
        return { min, sec };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasAutoMatched]);

  const handleAction = (type: string) => {
    if (type === 'payment') onNavigate?.('payment-select');
    else {
      // Use only recentActions for secondary actions (non-intrusive observability)
      addRecentAction(`Action: ${type}`);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    setActiveTrip(null);
    addRecentAction('Cancelled ride request');
    success('行程已取消', '请求已取消，返回首页');
    onNavigate?.('core-home');
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px 217px 32px 24px' }}>
        <span style={{ width: 16, height: 16, cursor: 'pointer', fontSize: 16, color: '#49493d' }} onClick={() => onNavigate?.('booking-confirm-pickup3')}>↑</span>
        <span style={{ fontSize: 20, fontWeight: 500, color: '#49493d' }}>Requesting</span>
      </div>

      <div className={styles.tripInfoCard}>
        <p className={styles.pickupTime}>
          <span>Pick up in&nbsp;</span>
          <span className={styles.timeValue}>{countdown.min}m {countdown.sec}s</span>
        </p>
        <p className={styles.destination}>To {activeTrip?.to || 'Apple Union Square'}</p>
        <p className={styles.departureInfo}>At {liveEta || activeTrip?.eta || '3:50 PM'} from {activeTrip?.from || '51 Sharon St'}</p>
        <p className={styles.priceRange}>${activeTrip?.price || '13'}-{activeTrip?.price ? Math.round(activeTrip.price + 3) : '16'}</p>
        {/* Live driver indicator (appears after first ping for visual feedback) */}
        {(liveDriver || activeTrip?.driver) && (
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#00b894', fontWeight: 500 }}>
            🚕 {(liveDriver || activeTrip?.driver)} en route — live update
          </p>
        )}
      </div>

      {/* NEW: Live driver pings card — realistic simulation UI with progress bar + ping feed (design language preserved) */}
      <div className={styles.liveUpdatesCard}>
        <div className={styles.liveHeader}>
          <span className={styles.liveDot} />
          <span>LIVE DRIVER PINGS — {progress > 5 ? `${Math.floor(progress)}% matched` : 'Broadcasting to nearby drivers...'}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        {livePings.length > 0 ? (
          <div className={styles.pingList}>
            {livePings.map((ping, idx) => (
              <div key={idx} className={styles.pingItem}>{ping}</div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: '#959595', paddingTop: 2 }}>Waiting for driver responses (simulated every ~3s)...</div>
        )}
        {liveDriver && liveEta && (
          <div style={{ marginTop: 6, fontSize: 11, color: '#49493d', fontWeight: 500 }}>
            Current lead: <strong>{liveDriver}</strong> • {liveEta} • updating live
          </div>
        )}
      </div>

      <div className={styles.actionCard}>
        <div className={styles.actionItem} onClick={() => handleAction('dest')}>
          <div className={styles.actionContent}>
            <span className={styles.actionIcon}>📍</span>
            <span className={styles.actionText}>Apple Union Square</span>
            <span className={styles.actionLink}>Add or change</span>
          </div>
          <div className={styles.divider} />
        </div>

        <div className={styles.actionItem} onClick={() => handleAction('payment')}>
          <div className={styles.actionContent}>
            <span className={styles.actionIcon}>💳</span>
            <span className={styles.actionText}>{_selectedPayment.label}</span>
            <span className={`${styles.actionLink} ${styles.actionLink}`}>Change</span>
          </div>
          <div className={styles.divider} />
        </div>

        <div className={styles.actionItem} onClick={() => handleAction('split')}>
          <div className={styles.actionContent}>
            <span className={styles.actionIcon}>📶</span>
            <span className={styles.actionText}>Riding with someone?</span>
            <span className={styles.actionLink}>Split fare</span>
          </div>
          <div className={styles.divider} />
        </div>

        <div className={styles.actionItem} onClick={() => handleAction('share')}>
          <div className={styles.actionContent}>
            <span className={styles.actionIcon}>👤</span>
            <span className={styles.actionText}>Share trips status</span>
            <span className={styles.actionLink}>Share</span>
          </div>
          <div className={styles.divider} />
        </div>

        <button className={styles.cancelButton} onClick={handleCancel}>
          <span className={styles.cancelText}>Cancel</span>
        </button>

        {/* Improved: Uses shared trigger (live state + new APIs). Auto-fires on built-in timer=0 too. */}
        <button
          onClick={() => triggerDriverMatch(true)}
          style={{
            marginTop: 10, width: '100%', padding: '11px 0', background: '#0A0908', color: '#fecc2a',
            border: '1px solid #fecc2a', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}
        >
          ✓ 模拟司机接单 (Driver matched)
        </button>
      </div>

      <p className={styles.promoInfo}>Visa local offers for Sep 19 - 25</p>
      <p className={styles.promoDetail}>Get Gody Cash buy using your Visa card around town</p>

      <div style={{ display: 'flex', marginTop: 95, padding: '21px 121px 8px 120px' }}>
        <div style={{ borderRadius: 100, background: '#49493d', width: 134, height: 5 }} />
      </div>

      <HomeIndicator />

      {/* Cancel confirmation modal (replaces native confirm) */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="取消行程请求"
        destructive
        confirmText="确认取消"
        onConfirm={confirmCancel}
      >
        <p style={{ margin: 0, fontSize: 14, color: '#C9C6BE' }}>
          确定要取消当前行程请求吗？此操作无法撤销。
        </p>
      </Modal>
    </div>
  );
};

export default RequestingPage;
