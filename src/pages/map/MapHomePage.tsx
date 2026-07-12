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
    addRecentAction('在地图主页选择了车辆');
    setTimeout(() => onNavigate?.('booking-choose-car'), 280);
  };

  return (
    <div className="mobile-frame">
      <StatusBar />

      <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(45deg,#ff6b6b,#4ecdc4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍💼</div>
        <div style={{ marginLeft: 14, fontSize: 16, fontWeight: 500 }}>早上好，{user.name.split(' ')[0]}</div>
        <div style={{ marginLeft: 'auto', fontSize: 22, cursor: 'pointer' }} onClick={() => { addRecentAction('从地图主页打开资料'); onNavigate?.('account-profile'); }}>☰</div>
      </div>

      {/* Current trip hint from DemoState */}
      {activeTrip && (
        <div onClick={() => { addRecentAction('点击了地图上的当前行程提示'); onNavigate?.('trip-upcoming'); }} style={{ margin: '8px 16px 0', background: '#fff8e1', border: '1px solid #fecc2a', borderRadius: 10, padding: '8px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🚗</span>
          <span>进行中：<strong>{activeTrip.to}</strong> ({activeTrip.status}) — 点击查看详情</span>
        </div>
      )}

      <div className={styles.mapArea}>
        <div className={styles.mapGrid} />
        <div className={styles.car} style={{ top: 105, left: 51 }} onClick={selectCar}>🚕</div>
        <div className={styles.car} style={{ top: 171, left: 236, transform: 'rotate(-47deg)' }} onClick={selectCar}>🚕</div>
        <div className={styles.car} style={{ top: 257, left: 212 }} onClick={selectCar}>🚕</div>
        <div className={styles.car} style={{ top: 240, left: 348, transform: 'rotate(90deg)' }} onClick={selectCar}>🚕</div>

        <div className={styles.locationBtn} onClick={() => { addRecentAction('在地图主页使用定位'); info('定位', '定位成功 （演示）'); }}>🎯</div>
      </div>

      <div className={styles.bottomPanel}>
        <div className={styles.searchBox} onClick={() => { addRecentAction('从地图打开搜索'); onNavigate?.('core-search1'); }}>
          🔍 <span style={{ marginLeft: 8, color: '#959595' }}>搜索您的位置</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, textDecoration: 'underline', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); addRecentAction('从地图预约'); onNavigate?.('booking-schedule'); }}>预约</span>
        </div>

        <div style={{ marginTop: 22 }}>
          <div onClick={() => { addRecentAction('查看了收藏地点'); info('地点', '收藏地点（演示）'); }} style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}>⭐ <span style={{ marginLeft: 8 }}>收藏地点</span></div>
          <div style={{ height: 1, background: '#f3f3f3', margin: '6px 0 12px' }} />
          <div onClick={() => { addRecentAction('在地图上设置位置'); info('地图', '在地图上设置位置（演示）'); }} style={{ display: 'flex', alignItems: 'center' }}>📍 <span style={{ marginLeft: 8 }}>在地图上设置位置</span></div>
        </div>

        <div className={styles.actionRow}>
          <div className={`${styles.actionBtn} ${styles.tripsBtn}`} onClick={() => { addRecentAction('从地图主页打开行程'); onNavigate?.('trips-hub'); }}>🚗 行程</div>
          <div className={`${styles.actionBtn} ${styles.eatsBtn}`} onClick={() => {
            addRecentAction('打开外卖演示');
            placeEatsOrder('地图快餐', '街头包子', 18);
            bookTrip({ from: '地图快餐', to: '当前位置', driver: '骑手', vehicle: '自行车', price: 18, status: 'upcoming', eta: '12 分钟' });
            success('外卖', '下单成功！¥18 包子 · 配送行程已记录');
          }}>🍽️ 外卖</div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};

export default MapHomePage;
