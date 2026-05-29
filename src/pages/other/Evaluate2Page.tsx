import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import styles from './Evaluate2Page.module.css';

interface Evaluate2PageProps {
  onNavigate?: (pageId: string) => void;
}

const Evaluate2Page: React.FC<Evaluate2PageProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const [rating, setRating] = useState(0);

  const rate = (r: number) => {
    setRating(r);
    setTimeout(() => {
      if (r >= 4) {
        success('感谢好评', `感谢您的 ${r} 星好评！`);
        onNavigate?.('trips-hub');
      } else {
        success('感谢反馈', `您给出了 ${r} 星评价，感谢您的反馈！`);
      }
    }, 240);
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ padding: '24px 24px 0' }}>
        <span style={{ fontSize: 22, cursor: 'pointer' }} onClick={() => onNavigate?.('trips-detail-completed')}>←</span>
      </div>

      <div className={styles.ratingCard}>
        <div className={styles.avatar}>👩‍💼</div>
        <div className={styles.title}>How was your trip with Push Puttichai?</div>
        <div className={styles.subtitle}>Tuesday to Apple Union Square</div>

        <div className={styles.stars}>
          {[1,2,3,4,5].map(n => (
            <span
              key={n}
              className={styles.star}
              style={{ color: n <= rating ? '#fecc2a' : '#e0e0e0' }}
              onClick={() => rate(n)}
            >
              {n <= rating ? '★' : '☆'}
            </span>
          ))}
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default Evaluate2Page;
