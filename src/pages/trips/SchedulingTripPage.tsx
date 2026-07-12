import React, { useState, useEffect } from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import { Modal, useToast } from '../../components/ui';

interface SchedulingTripPageProps {
  onNavigate?: (pageId: string) => void;
}

const SchedulingTripPage: React.FC<SchedulingTripPageProps> = ({ onNavigate }) => {
  const { activeTrip, addRecentAction, bookTrip, updateTripStatus } = useDemoState();
  const { success } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [statusText, setStatusText] = useState('正在安排您的行程');
  const [completed, setCompleted] = useState(false);
  const [showViewTripModal, setShowViewTripModal] = useState(false);

  const steps = [
    '正在连接司机...',
    '正在规划最佳路线...',
    '正在确认可用性...',
    '行程预约成功！'
  ];

  const dots = [0, 1, 2];

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next <= dots.length) {
            if (next > 0 && next <= dots.length) {
              // update text
              if (next - 1 < steps.length) {
                setStatusText(steps[next - 1]);
              }
            }
          }
          if (next > steps.length) {
            clearInterval(interval);
            setCompleted(true);
            setStatusText('行程预约成功！');
            setTimeout(() => {
              addRecentAction('行程安排完成');
              // Use bookTrip (new API) instead of manual setActiveTrip for full multi-trip integration + bookedTrips
              if (activeTrip?.id) {
                updateTripStatus(activeTrip.id, 'upcoming', { eta: '下午 3:50（已预约）', vehicle: activeTrip.vehicle || 'GodyX' });
                addRecentAction(`预约完成 — 已通过 updateTripStatus 更新（${activeTrip.to}）`);
              } else {
                const scheduled = bookTrip({
                  status: 'upcoming',
                  from: '当前位置',
                  to: '苹果联合广场',
                  eta: '3:50 PM',
                  price: 16,
                  vehicle: 'GodyX'
                });
                addRecentAction(`预约完成 — 已通过 bookTrip 预订（id：${scheduled.id}）`);
              }
              success('行程已安排', '行程安排成功！');
              setShowViewTripModal(true);
            }, 900);
            return steps.length;
          }
          return next;
        });
      }, 1400);
      return () => clearInterval(interval);
    }, 900);

    return () => clearTimeout(timer);
  }, [onNavigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContainerClick = () => {
    // restart animation on tap (demo)
    addRecentAction('已重启行程安排动画');
    setCurrentStep(0);
    setStatusText('正在安排您的行程');
    setCompleted(false);
  };

  return (
    <div className="mobile-frame" style={{ height: 812, background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), #333', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <StatusBar dark />

      <div onClick={handleContainerClick} style={{ textAlign: 'center', color: '#fff', cursor: 'pointer' }}>
        {/* Spinner */}
        <div style={{
          width: 60, height: 60, border: '3px solid rgba(255,255,255,0.3)',
          borderTop: completed ? '3px solid #00b894' : '3px solid #fecc2a',
          borderRadius: '50%',
          animation: completed ? 'none' : 'spin 1s linear infinite',
          margin: '0 auto 40px'
        }} />

        <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '0.5px', color: completed ? '#00b894' : '#fff' }}>
          {statusText}
        </div>
        {activeTrip && (
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>进行中： {activeTrip.to} ({activeTrip.status})</div>
        )}

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
          {dots.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i < currentStep ? '#00b894' : (i === currentStep ? '#fecc2a' : 'rgba(255,255,255,0.3)'),
                transform: i === currentStep ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      <HomeIndicator />

      <Modal
        open={showViewTripModal}
        onClose={() => {
          setShowViewTripModal(false);
          onNavigate?.('core-home');
        }}
        title="行程安排成功"
      >
        <p style={{ marginBottom: 16, color: '#B8B5B0' }}>
          是否立即查看您的行程详情？
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setShowViewTripModal(false);
              onNavigate?.('core-home');
            }}
            style={{
              padding: '8px 16px',
              background: '#2A2926',
              color: '#EDEBE5',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            稍后查看
          </button>
          <button
            onClick={() => {
              setShowViewTripModal(false);
              onNavigate?.('trip-upcoming');
            }}
            style={{
              padding: '8px 16px',
              background: '#fecc2a',
              color: '#0A0908',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            查看行程
          </button>
        </div>
      </Modal>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SchedulingTripPage;
