import React, { useState } from 'react';
import { StatusBar } from '../../components/mobile';
import { useToast } from '../../components/ui';
import { Modal } from '../../components/ui'; // used in JSX below
import { useDemoState } from '../../context/DemoStateContext';
import styles from './SchedulePage.module.css';

interface SchedulePageProps {
  onNavigate?: (pageId: string) => void;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { success, info } = useToast();
  const [selectedDate, setSelectedDate] = useState('今天');
  const [selectedDay, setSelectedDay] = useState('3');
  const [selectedTime, setSelectedTime] = useState('50');
  const [selectedAmPm, setSelectedAmPm] = useState('下午');

  // Modal state (restored for build)
  const [showCancelModal, setShowCancelModal] = useState(false);

  const updateDisplay = () => {
    const start = parseInt(selectedTime) - 10;
    return `${start}:00 ${selectedAmPm} - ${selectedTime}:00 ${selectedAmPm}`;
  };

  const handleSelectDate = (val: string, el: HTMLElement) => {
    document.querySelectorAll(`.${styles.timeColumn}:first-child .${styles.timeItem}`).forEach(i => i.classList.remove(styles.selected, styles.active));
    el.classList.add(styles.selected, styles.active);
    setSelectedDate(val);
  };

  const handleSelectDay = (val: string, el: HTMLElement) => {
    document.querySelectorAll(`.${styles.timeColumn}:nth-child(3) .${styles.timeItem}`).forEach(i => i.classList.remove(styles.selected, styles.active));
    el.classList.add(styles.selected, styles.active);
    setSelectedDay(val);
  };

  const handleSelectTime = (val: string, el: HTMLElement) => {
    document.querySelectorAll(`.${styles.timeColumn}:nth-child(5) .${styles.timeItem}`).forEach(i => i.classList.remove(styles.selected, styles.active));
    el.classList.add(styles.selected, styles.active);
    setSelectedTime(val);
  };

  const handleSelectAmPm = (val: string, el: HTMLElement) => {
    document.querySelectorAll(`.${styles.ampmItem}`).forEach(i => i.classList.remove(styles.selected, styles.active));
    el.classList.add(styles.selected, styles.active);
    setSelectedAmPm(val);
  };

  const handleContinue = () => {
    const btn = document.querySelector(`.${styles.btnContinue}`) as HTMLElement;
    if (btn) btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      if (btn) btn.style.transform = 'scale(1)';
      addRecentAction(`已预约行程 ${selectedDate} ${selectedTime}:${selectedAmPm}`);
      // Use bookTrip for persistent multi-trip + active focus (new core feature)
      const booked = bookTrip({
        status: 'upcoming',
        from: activeTrip?.from || '当前位置',
        to: activeTrip?.to || '苹果联合广场',
        eta: `${selectedTime}:00 ${selectedAmPm}`,
        price: activeTrip?.price || 18,
        vehicle: activeTrip?.vehicle || '预约行程'
      });
      // Stronger integration: immediately attach driver + confirm via updateTripStatus (defensive)
      if (booked.id) {
        updateTripStatus(booked.id, 'upcoming', {
          driver: '预约司机 · GodyX',
          eta: `${selectedTime}:00 ${selectedAmPm}（已确认）`
        });
      }
      addRecentAction(`继续预约并已通过 updateTripStatus 绑定司机（${booked.to}）`);
      success('行程已安排', `日期：${selectedDate} ${selectedDay} 月 · 时间：${selectedTime}:00 ${selectedAmPm}`);
      onNavigate?.('booking-requesting');
    }, 140);
  };

  const handleCarClick = (idx: number) => {
    addRecentAction('已在预约地图选择车辆');
    info('车辆选择', `已选择车辆 ${idx + 1}（演示）`);
  };

  const handleCancel = () => {
    addRecentAction('已取消预约');
    info('取消', '行程安排已取消 （演示）');
    onNavigate?.('core-home');
  };

  return (
    <div className={styles.scheduleContainer}>
      <StatusBar dark />

      <div style={{ display: 'flex', alignItems: 'center', padding: '0 24px', marginTop: 24 }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>👨‍💼</div>
        <p style={{ margin: '0 0 0 22px', fontSize: 16, fontWeight: 500, color: '#fff' }}>早上好，John</p>
        <div style={{ marginLeft: 'auto', width: 20, height: 20, cursor: 'pointer', fontSize: 18, color: '#fff' }} onClick={() => info('菜单', '打开菜单（演示）')}>☰</div>
      </div>

      <div className={styles.mapArea}>
        <div className={styles.mapBackground}>
          <div className={styles.mapGrid} />
          <div className={styles.mapCar} style={{ top: 80, right: 30, transform: 'rotate(30deg)' }} onClick={() => handleCarClick(0)}>🚕</div>
          <div className={styles.mapCar} style={{ top: 120, right: 60, transform: 'rotate(45deg)' }} onClick={() => handleCarClick(1)}>🚕</div>
          <div className={styles.mapCar} style={{ top: 160, right: 40, transform: 'rotate(20deg)' }} onClick={() => handleCarClick(2)}>🚕</div>
          <div className={styles.locationPin} />
        </div>
      </div>

      <div className={styles.scheduleModal}>
        <div className={styles.dragHandle} onClick={() => info('提示', '拖拽手势提示（演示）')} />

        <h2 className={styles.modalTitle}>预约行程</h2>
        <p className={styles.modalSubtitle}>9 月 24 日 周二</p>
        <p className={styles.modalTime}>{updateDisplay()}</p>

        <div className={styles.datetimePicker}>
          {/* Date column */}
          <div className={styles.timeColumn}>
            {['9 月 22 日 周日', '9 月 23 日 周一', '今天', '9 月 25 日 周三', '9 月 26 日 周四'].map((d, idx) => (
              <div
                key={idx}
                className={`${styles.timeItem} ${d === selectedDate ? styles.selected + ' ' + styles.active : d === '今天' ? styles.active : ''}`}
                onClick={(e) => handleSelectDate(d, e.currentTarget)}
              >{d}</div>
            ))}
          </div>

          <div className={styles.separator} />

          {/* Day nums */}
          <div className={styles.timeColumn}>
            {['1','2','3','4','5'].map((d, idx) => (
              <div
                key={idx}
                className={`${styles.timeItem} ${d === selectedDay ? styles.selected + ' ' + styles.active : d === '3' ? styles.active : ''}`}
                onClick={(e) => handleSelectDay(d, e.currentTarget)}
              >{d}</div>
            ))}
          </div>

          <div className={styles.separator} />

          {/* Minutes */}
          <div className={styles.timeColumn}>
            {['40','45','50','55','60'].map((t, idx) => (
              <div
                key={idx}
                className={`${styles.timeItem} ${t === selectedTime ? styles.selected + ' ' + styles.active : t === '50' ? styles.active : ''}`}
                onClick={(e) => handleSelectTime(t, e.currentTarget)}
              >{t}</div>
            ))}
          </div>

          {/* AM/PM */}
          <div className={styles.ampmColumn}>
            {['上午','下午'].map((a, idx) => (
              <div
                key={idx}
                className={`${styles.ampmItem} ${a === selectedAmPm ? styles.selected + ' ' + styles.active : a === '下午' ? styles.active : ''}`}
                onClick={(e) => handleSelectAmPm(a, e.currentTarget)}
              >{a}</div>
            ))}
          </div>
        </div>

        <div className={styles.modalButtons}>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={handleCancel}>取消</button>
          <button className={`${styles.btn} ${styles.btnContinue}`} onClick={handleContinue}>继续</button>
        </div>

        <div className={styles.homeIndicator}>
          <div className={styles.indicator} />
        </div>
      </div>

      {/* Cancel confirmation modal */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="取消行程安排"
        destructive
        confirmText="确认取消"
        onConfirm={() => { setShowCancelModal(false); info('行程已取消 （演示）'); }}
      >
        <p style={{ margin: 0, fontSize: 14, color: '#C9C6BE' }}>
          确定要取消当前的行程安排吗？
        </p>
      </Modal>
    </div>
  );
};

export default SchedulePage;
