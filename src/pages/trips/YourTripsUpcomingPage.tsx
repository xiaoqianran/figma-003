import React from 'react';
import { StatusBar, HomeIndicator } from '../../components/mobile';
import { useDemoState } from '../../context/DemoStateContext';
import TripCard from '../../components/mobile/TripCard';

interface Props {
  onNavigate?: (pageId: string) => void;
}

const YourTripsUpcomingPage: React.FC<Props> = ({ onNavigate }) => {
  const { activeTrip, bookedTrips, addRecentAction } = useDemoState();
  const goBack = () => onNavigate?.('trips-hub');
  const switchToPast = () => onNavigate?.('trips-past');

  const upcomingFromBooked = bookedTrips.filter((t) => t.status === 'upcoming' || t.status === 'in-progress');
  const hasUpcoming = !!(activeTrip || upcomingFromBooked.length > 0);
  const count = upcomingFromBooked.length + (activeTrip && (activeTrip.status === 'upcoming' || activeTrip.status === 'in-progress') ? 1 : 0);

  return (
    <div className="mobile-frame" style={{ background: '#f7f6f3', overflow: 'hidden' }}>
      <StatusBar />

      <div style={{ padding: '8px 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button type="button" className="icon-btn" aria-label="返回" onClick={goBack} style={{ background: '#fff', border: '1px solid #ebe9e4' }}>
            ←
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111318', letterSpacing: '-0.02em' }}>我的行程</div>
            <div style={{ fontSize: 11, color: '#9b9aa3', marginTop: 1 }}>即将开始与进行中</div>
          </div>
        </div>
        <button
          type="button"
          className="secondary-btn"
          onClick={switchToPast}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 14px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            boxShadow: '0 2px 10px rgba(17,19,24,0.04)',
          }}
        >
          即将开始 <span style={{ fontSize: 10, opacity: 0.6 }}>▼</span>
        </button>
      </div>

      {hasUpcoming ? (
        <div className="page-scroll" style={{ paddingBottom: 8 }}>
          <div style={{ margin: '4px 20px 12px', fontSize: 12, color: '#6b6a73' }}>
            来自演示状态 · <strong style={{ color: '#111318' }}>{count}</strong> 条进行中
          </div>

          {activeTrip && (activeTrip.status === 'upcoming' || activeTrip.status === 'in-progress') && (
            <div style={{ marginBottom: 6 }}>
              <div
                style={{
                  fontSize: 10,
                  color: '#8a6400',
                  marginBottom: 6,
                  paddingLeft: 24,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                当前焦点
              </div>
              <TripCard
                status={activeTrip.status === 'in-progress' ? 'in-progress' : 'upcoming'}
                title={`${activeTrip.vehicle || '行程'} 前往 ${activeTrip.to}`}
                time={`${activeTrip.eta || '今天'} · ${activeTrip.from || ''} → ${activeTrip.to}`}
                from={activeTrip.from || '当前位置'}
                to={activeTrip.to}
                price={activeTrip.price ? String(activeTrip.price) : undefined}
                driver={activeTrip.driver}
                selected
                onClick={() => onNavigate?.('trip-upcoming')}
              />
            </div>
          )}

          {upcomingFromBooked
            .filter((t) => !activeTrip || t.id !== activeTrip.id)
            .map((trip) => (
              <div key={trip.id} style={{ marginBottom: 2 }}>
                <TripCard
                  status={trip.status === 'in-progress' ? 'in-progress' : 'upcoming'}
                  title={`${trip.vehicle || '行程'} 前往 ${trip.to}`}
                  time={`${trip.eta || '已预约'} · ${trip.from} → ${trip.to}`}
                  from={trip.from}
                  to={trip.to}
                  price={trip.price ? String(trip.price) : undefined}
                  driver={trip.driver}
                  onClick={() => onNavigate?.('trip-upcoming')}
                />
              </div>
            ))}

          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              addRecentAction('查看即将开始行程详情');
              onNavigate?.('trip-upcoming');
            }}
            style={{ margin: '14px 20px 20px', width: 'calc(100% - 40px)', height: 50 }}
          >
            查看当前行程详情
          </button>
        </div>
      ) : (
        <div style={{ padding: '8px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            className="map-mock"
            style={{
              width: '100%',
              height: 180,
              borderRadius: 20,
              position: 'relative',
              border: '1px solid #ebe9e4',
              overflow: 'hidden',
            }}
          >
            <div className="map-mock-grid" />
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 42, opacity: 0.35 }}>🗺️</div>
          </div>

          <p style={{ margin: '28px 0 0', fontSize: 18, fontWeight: 700, color: '#111318', textAlign: 'center', letterSpacing: '-0.02em' }}>
            暂无即将开始的行程
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#9b9aa3', marginTop: 8, lineHeight: 1.45, maxWidth: 260 }}>
            从首页或选车页预约行程后，将显示在这里并同步演示状态。
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              addRecentAction('从空行程页去叫车');
              onNavigate?.('core-home');
            }}
            style={{ marginTop: 24, width: '100%', height: 50 }}
          >
            去叫车
          </button>
        </div>
      )}

      <HomeIndicator />
    </div>
  );
};

export default YourTripsUpcomingPage;
