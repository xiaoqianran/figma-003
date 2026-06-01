import React, { useState, useEffect, useRef } from 'react';
import { StatusBar, HomeIndicator, TopNav } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './NotificationPage.module.css';

interface NotificationPageProps {
  onNavigate?: (pageId: string) => void;
}

const NotificationPage: React.FC<NotificationPageProps> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, addRecentAction } = useDemoState();
  const { success } = useToast();
  const [buttonText, setButtonText] = useState('启用推送通知');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonVariant, setButtonVariant] = useState<'default' | 'success' | 'error'>('default');

  const scooterRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const animationIntervals = useRef<number[]>([]);

  const goBack = () => {
    addRecentAction('Back from notifications');
    onNavigate?.('core-home');
  };

  // Exact animation logic ported from original addAnimations()
  const startAnimations = () => {
    // Clear any previous intervals
    animationIntervals.current.forEach(id => clearInterval(id));
    animationIntervals.current = [];

    // Scooter animation (moves right then back)
    if (scooterRef.current) {
      const scooter = scooterRef.current;
      scooter.style.transition = 'transform 3s ease-in-out';

      const scooterInterval = window.setInterval(() => {
        if (scooter) {
          scooter.style.transform = 'rotate(-15deg) translateX(10px)';
          setTimeout(() => {
            if (scooter) {
              scooter.style.transform = 'rotate(-15deg) translateX(0px)';
            }
          }, 1500);
        }
      }, 4000);

      animationIntervals.current.push(scooterInterval);
    }

    // Truck animation (moves left then back)
    if (truckRef.current) {
      const truck = truckRef.current;
      truck.style.transition = 'transform 4s ease-in-out';

      const truckInterval = window.setInterval(() => {
        if (truck) {
          truck.style.transform = 'translateX(-10px)';
          setTimeout(() => {
            if (truck) {
              truck.style.transform = 'translateX(0px)';
            }
          }, 2000);
        }
      }, 5000);

      animationIntervals.current.push(truckInterval);
    }
  };

  // Illustration click feedback (exact)
  const handleIllustrationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.transform = 'scale(0.95)';
    addRecentAction('Interacted with notification illustration');
    setTimeout(() => {
      el.style.transform = 'scale(1)';
    }, 150);
  };

  // Exact enableNotifications logic ported (with React state instead of DOM)
  const enableNotifications = async () => {
    const originalText = buttonText;

    setButtonText('请求权限中...');
    setButtonDisabled(true);

    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
          setButtonText('通知已启用 ✓');
          setButtonVariant('success');

          // Show example notification
          setTimeout(() => {
            try {
              new Notification('GODY', {
                body: '欢迎使用GODY！您将收到实时行程更新。',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23fecc2a"/><text x="50" y="60" text-anchor="middle" fill="%2349493d" font-size="30">G</text></svg>'
              });
            } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
              // Some browsers block auto notifications without user gesture
              console.log('Notification shown in console (browser policy)');
            }
          }, 1000);

          // Auto-navigate demo after success (sensible)
          setTimeout(() => {
            onNavigate?.('core-home');
          }, 2200);
        } else {
          setButtonText('权限被拒绝');
          setButtonVariant('error');
          setTimeout(() => {
            resetButton();
          }, 1800);
        }
      } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
        // Fallback
        handleFallbackNotification(originalText);
      }
    } else {
      handleFallbackNotification(originalText);
    }
  };

  const handleFallbackNotification = (_originalText: string) => {
    void _originalText; // intentionally unused (kept for API parity)
    setTimeout(() => {
      success('通知', '通知权限已授予！您将收到实时行程更新。');
      setButtonText('通知已启用 ✓');
      setButtonVariant('success');

      setTimeout(() => {
        onNavigate?.('core-home');
      }, 1600);
    }, 1500);
  };

  const resetButton = () => {
    setButtonText('启用推送通知');
    setButtonDisabled(false);
    setButtonVariant('default');
  };

  // Start animations on mount (exact port)
  useEffect(() => {
    startAnimations();

    // Cleanup intervals on unmount
    return () => {
      animationIntervals.current.forEach(id => clearInterval(id));
    };
  }, []);

  const buttonClass = [
    styles.enableButton,
    buttonVariant === 'success' ? styles.success : '',
    buttonVariant === 'error' ? styles.error : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="mobile-frame" style={{ height: 812, overflow: 'hidden', alignItems: 'flex-start' }}>
      <StatusBar />

      {/* Back navigation using shared TopNav (per migration spec) - visually faithful back arrow */}
      <TopNav onBack={goBack} />

      {activeTrip && <div style={{ margin: '0 16px 8px', fontSize: 12, padding: '4px 10px', background: '#e8f4f8', borderRadius: 6 }}>Trip update: {activeTrip.to} ({activeTrip.status})</div>}

      {/* Dynamic recent trip notifications from bookedTrips (new) */}
      {bookedTrips.length > 0 && (
        <div style={{ margin: '0 16px 12px', fontSize: 12 }}>
          <div style={{ color: '#6E6A61', marginBottom: 4, paddingLeft: 4 }}>Recent trip updates</div>
          {bookedTrips.slice(-3).reverse().map((t, idx) => (
            <div key={idx} style={{ padding: '6px 10px', background: '#fff', borderRadius: 6, marginBottom: 4, border: '1px solid #eee', cursor: 'pointer' }}
                 onClick={() => {
                   addRecentAction(`Viewed notification for trip to ${t.to}`);
                   onNavigate?.(t.status === 'completed' ? 'trips-detail-completed' : 'trip-upcoming');
                 }}>
              {t.status === 'completed' ? '✅' : t.status === 'in-progress' ? '🚕' : '📅'} {t.from} → {t.to} · {t.status}
            </div>
          ))}
        </div>
      )}

      {/* 插画区域 - EXACT structure, classes and dimensions from original HTML */}
      <div className={styles.illustration} onClick={handleIllustrationClick}>
        <div className={styles.illustrationBg}>
          {/* 摩托车 */}
          <div ref={scooterRef} className={styles.scooter}>🛵</div>

          {/* 手机模拟器 */}
          <div className={styles.phoneMockup}>
            <div className={styles.phoneScreen}>
              <div className={styles.mapInterface}>
                <div className={styles.mapGrid}></div>
                <div className={styles.locationMarker}></div>

                {/* 装饰元素 */}
                <div className={`${styles.decoration} ${styles.decoration1}`}></div>
                <div className={`${styles.decoration} ${styles.decoration2}`}></div>
                <div className={`${styles.decoration} ${styles.decoration3}`}></div>
              </div>
            </div>
          </div>

          {/* 时钟图标 */}
          <div className={styles.clockIcon}>🕐</div>

          {/* 卡车 */}
          <div ref={truckRef} className={styles.truck}>🚚</div>
        </div>

        {/* 路径线条 */}
        <div className={styles.pathLine}></div>
      </div>

      {/* 主要文本 */}
      <p className={styles.content}>Relax with real- time&nbsp;&nbsp;trip updates</p>

      {/* 副文本 */}
      <p className={styles.subContent}>Please enable push notifications from Gody when prompted</p>

      {/* 启用通知按钮 - fully interactive with states */}
      <button
        className={buttonClass}
        onClick={enableNotifications}
        disabled={buttonDisabled}
        type="button"
      >
        {buttonText}
      </button>

      {/* 底部指示器 - exact wrapper padding (using shared component inside positioned wrapper for fidelity) */}
      <div className={styles.homeIndicatorWrapper}>
        <HomeIndicator />
      </div>
    </div>
  );
};

export default NotificationPage;
