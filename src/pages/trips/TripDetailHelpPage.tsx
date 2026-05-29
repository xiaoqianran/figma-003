import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { useToast as useToast_ } from '../../components/ui';
import styles from './TripDetailHelpPage.module.css';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const TripDetailHelpPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction } = useDemoState();
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

        <HomeIndicator />
      </div>
    </div>
  );
};

export default TripDetailHelpPage;
