import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import styles from './Evaluate1Page.module.css';

interface Evaluate1PageProps {
  onNavigate?: (pageId: string) => void;
}

const Evaluate1Page: React.FC<Evaluate1PageProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const [rating, setRating] = useState(0);

  const rate = (r: number) => {
    setRating(r);
    setTimeout(() => {
      success('感谢评价', `您给出了 ${r} 星评价`);
    }, 220);
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => onNavigate?.('trips-hub')}>←</span>
        <span style={{ fontSize: 18, fontWeight: 500 }}>Tuesday to Apple Union Square</span>
      </div>

      <div className={styles.ratingCard}>
        <div className={styles.avatar}>👩‍💼</div>

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

        <div className={styles.complimentBtn} onClick={() => success('赞美', '打开赞美选项（演示）')}>
          👥 <span>Give a compliment</span>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default Evaluate1Page;
