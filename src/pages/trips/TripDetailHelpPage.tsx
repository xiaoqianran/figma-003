import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast as useToast_ } from '../../components/ui';
import styles from './TripDetailHelpPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripDetailHelpPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, setActiveTrip, addRecentAction, updateTripStatus, completeTrip, cancelTrip } = useDemoState();
  const { success, info } = useToast_();
  const goBack = () => {
    addRecentAction('Back from trip help detail');
    onNavigate?.('trips-past');
  };

  const handleHelpOption = (label: string) => {
    addRecentAction(`Help option selected: ${label}`);
    info('帮助选项', `已选择: ${label} (demo)`);
    if (label.includes('accident')) onNavigate?.('other-evaluate2');
  };

  // NEW: functional mutation helpers callable from help page actions (for demo flow)
  const handleCompleteFromHelp = () => {
    const id = activeTrip?.id;
    addRecentAction('Completed trip from help page via completeTrip');
    if (id) completeTrip(id);
    success('完成', 'Trip completed from help flow');
    onNavigate?.('trips-past');
  };
  const handleCancelFromHelp = () => {
    const id = activeTrip?.id;
    addRecentAction('Cancelled from help page via cancelTrip');
    if (id) cancelTrip(id);
    onNavigate?.('trips-past');
  };
  const handleUpdateStatusFromHelp = (status: 'upcoming' | 'in-progress' | 'completed') => {
    const id = activeTrip?.id;
    if (id) {
      updateTripStatus(id, status);
      addRecentAction(`Updated status to ${status} from help`);
    }
    onNavigate?.(status === 'completed' ? 'trips-past' : 'trips-upcoming');
  };

  React.useEffect(() => {
    addRecentAction('Viewed trip help detail page');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mobile-frame" style={{ background: '#fff', height: 947 }}>
      <StatusBar />

      <div className={styles.container}>
        <div className={styles.titleBar}>
          <span className={styles.backIcon} onClick={goBack}>←</span>
          <span className={styles.title}>Trips detail</span>
        </div>

        <div className={styles.locationSection}>
          <div className={styles.locationIcons}>
            <div className={styles.hereDot}><div className={styles.hereDotInner} /></div>
            <div className={styles.locationLine} />
            <span style={{ fontSize: 16 }}>📍</span>
          </div>
          <div>
            <div className={styles.locInput}>{activeTrip?.to || 'Apple Union Square'}</div>
            <div className={styles.locInput}>{activeTrip?.from || 'San Francisco International Airport'}</div>
          </div>
        </div>

        <div className={styles.ratingRow}>
          <div className={styles.avatar}>👤</div>
          <div className={styles.ratingLabel}>You rated Push</div>
          <div className={styles.ratingStars}>{Array.from({length:5}).map((_,i)=><span key={i} style={{color:'#fecc2a'}}>★</span>)}</div>
        </div>

        <div className={styles.helpLink} onClick={() => info('帮助', '打开帮助中心 (demo)')}>Need help with this trip?</div>

        <div className={styles.actionRow}>
          <div className={styles.actionCard} onClick={() => { addRecentAction('Switched payment from help page'); success('支付', 'Switch payment (demo)'); }}>
            <div style={{fontWeight:500}}>Switch payment method</div>
            <div style={{fontSize:14,color:'#959595',marginTop:12}}>I want to switch my payment method for this trip.</div>
          </div>
          <div className={styles.actionCard} onClick={() => { addRecentAction('Opened payment from help'); onNavigate?.('payment-select'); }}>
            <div style={{fontWeight:500}}>Switch payment method</div>
            <div style={{fontSize:14,color:'#959595',marginTop:12}}>I want to switch my payment method for this trip.</div>
          </div>
        </div>

        {/* Help / Receipt */}
        <div className={styles.helpReceiptRow}>
          <div className={styles.helpBtn} onClick={() => { addRecentAction('Opened help center from trip'); info('帮助中心', 'Help center opened (demo)'); }}>Help</div>
          <div className={styles.receiptBtn} onClick={() => { addRecentAction('Downloaded receipt'); success('收据', 'Receipt downloaded (demo)'); }}>Receipt</div>
        </div>

        {/* Help options */}
        <div className={styles.helpOption} onClick={() => handleHelpOption('I was involved in accident')}>
          I was involved in accident <span>→</span>
        </div>
        <div className={styles.helpOption} onClick={() => handleHelpOption('Review my fare or fees')}>Review my fare or fees</div>
        <div className={styles.helpOption} onClick={() => handleHelpOption('I lost an item')}>I lost an item</div>
        <div className={styles.helpOption} onClick={() => handleHelpOption('My driver was unprofessional')}>My driver was unprofessional</div>
        <div className={styles.helpOption} onClick={() => handleHelpOption('My vehicle wasn\'t what I expected')}>My vehicle wasn't what I expected</div>

        {/* NEW: functional Cancel/Complete/Status mutation buttons in Help detail (leverage APIs, ensure past list population) */}
        <div style={{ padding: '16px 24px 8px', background: '#fafaf8', margin: '12px 0 0' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#49493d', marginBottom: 8 }}>Quick status actions (demo - mutates bookedTrips + active):</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={handleCompleteFromHelp} style={{ flex: '1 1 45%', padding: '10px 12px', fontSize: 13, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>✓ Complete trip</button>
            <button onClick={handleCancelFromHelp} style={{ flex: '1 1 45%', padding: '10px 12px', fontSize: 13, background: '#c62828', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>✕ Cancel trip</button>
            <button onClick={() => handleUpdateStatusFromHelp('in-progress')} style={{ flex: '1 1 45%', padding: '8px 12px', fontSize: 12, background: '#fff', border: '1px solid #fecc2a', borderRadius: 10, cursor: 'pointer' }}>Set In-Progress</button>
            <button onClick={() => handleUpdateStatusFromHelp('upcoming')} style={{ flex: '1 1 45%', padding: '8px 12px', fontSize: 12, background: '#fff', border: '1px solid #fecc2a', borderRadius: 10, cursor: 'pointer' }}>Set Upcoming</button>
          </div>
          {activeTrip && <div style={{ fontSize: 10, marginTop: 6, color: '#6E6A61' }}>Current: {activeTrip.to} ({activeTrip.status}) | total booked: {bookedTrips.length}</div>}
          {bookedTrips.filter(t=>t.status==='completed').length > 0 && (
            <div style={{ fontSize: 10, marginTop: 4 }}>
              Past in state: {bookedTrips.filter(t=>t.status==='completed').length} — <span onClick={() => { const p = bookedTrips.find(t=>t.status==='completed'); if(p){setActiveTrip(p); onNavigate?.('trips-detail-completed');} }} style={{color:'#fecc2a', cursor:'pointer'}}>view in Past detail</span>
            </div>
          )}
        </div>

        <HomeIndicator />
      </div>
    </div>
  );
};

export default TripDetailHelpPage;
