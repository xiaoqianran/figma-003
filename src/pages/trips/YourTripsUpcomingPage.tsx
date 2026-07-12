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
          <button type="button" className="icon-btn" aria-label="Back" onClick={goBack} style={{ background: '#fff', border: '1px solid #ebe9e4' }}>
            ←
          </button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#111318', letterSpacing: '-0.02em' }}>Your trips</div>
            <div style={{ fontSize: 11, color: '#9b9aa3', marginTop: 1 }}>Upcoming & in progress</div>
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
          Upcoming <span style={{ fontSize: 10, opacity: 0.6 }}>▼</span>
        </button>
      </div>

      {hasUpcoming ? (
        <div className="page-scroll" style={{ paddingBottom: 8 }}>
          <div style={{ margin: '4px 20px 12px', fontSize: 12, color: '#6b6a73' }}>
            Live from demo state · <strong style={{ color: '#111318' }}>{count}</strong> active
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
                Current focus
              </div>
              <TripCard
                status={activeTrip.status === 'in-progress' ? 'in-progress' : 'upcoming'}
                title={`${activeTrip.vehicle || 'Ride'} to ${activeTrip.to}`}
                time={`${activeTrip.eta || 'Today'} · ${activeTrip.from || ''} → ${activeTrip.to}`}
                from={activeTrip.from || 'Current location'}
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
                  title={`${trip.vehicle || 'Ride'} to ${trip.to}`}
                  time={`${trip.eta || 'Scheduled'} · ${trip.from} → ${trip.to}`}
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
              addRecentAction('Viewed upcoming trip details');
              onNavigate?.('trip-upcoming');
            }}
            style={{ margin: '14px 20px 20px', width: 'calc(100% - 40px)', height: 50 }}
          >
            View active trip details
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
            No upcoming trips
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#9b9aa3', marginTop: 8, lineHeight: 1.45, maxWidth: 260 }}>
            Book a ride from Home or Choose Car — it will show up here with live demo state.
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              addRecentAction('Book from empty upcoming trips');
              onNavigate?.('core-home');
            }}
            style={{ marginTop: 24, width: '100%', height: 50 }}
          >
            Book a ride
          </button>
        </div>
      )}

      <HomeIndicator />
    </div>
  );
};

export default YourTripsUpcomingPage;
