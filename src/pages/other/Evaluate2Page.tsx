import React, { useState } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { useDemoState } from '../../context/DemoStateContext';
import styles from './Evaluate2Page.module.css';

interface Evaluate2PageProps {
  onNavigate?: (pageId: string) => void;
}

const Evaluate2Page: React.FC<Evaluate2PageProps> = ({ onNavigate }) => {
  const { success } = useToast();
  const { activeTrip, bookedTrips, completeTrip, updateTripStatus, addRecentAction } = useDemoState();
  const [rating, setRating] = useState(0);

  const rate = (r: number) => {
    setRating(r);
    setTimeout(() => {
      // Integrate with full DemoState including bookedTrips: complete trip + review note on rating submit
      const latest = activeTrip || (bookedTrips.length > 0 ? bookedTrips[bookedTrips.length - 1] : null);
      if (latest) {
        if (latest.status !== 'completed') {
          completeTrip(latest.id);
        } else {
          updateTripStatus(latest.id, 'completed', { paid: true });
        }
        addRecentAction(`Submitted ${r}-star review for trip to ${latest.to} (Evaluate2)`);
      }

      if (r >= 4) {
        success('感谢好评', `感谢您的 ${r} 星好评！`);
        success('感谢评价！行程已归档。', '评价已保存 · 行程已移至已完成');
        setTimeout(() => {
          onNavigate?.(latest ? 'trips-detail-completed' : 'trips-past');
        }, 700);
      } else {
        success('感谢反馈', `您给出了 ${r} 星评价，感谢您的反馈！`);
        if (latest) {
          success('感谢评价！行程已归档。', `Trip to ${latest.to} archived via review`);
        }
        setTimeout(() => {
          onNavigate?.('trips-past');
        }, 700);
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
        <div className={styles.title}>与 Push Puttichai 的行程体验如何？</div>
        <div className={styles.subtitle}>周二 · 苹果联合广场</div>

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
