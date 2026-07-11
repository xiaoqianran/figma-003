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

  // NEW: Collect dynamic upcoming trips from persistent bookedTrips (status upcoming | in-progress)
  const upcomingFromBooked = bookedTrips.filter(t => t.status === 'upcoming' || t.status === 'in-progress');
  const hasUpcoming = activeTrip || upcomingFromBooked.length > 0;

  return (
    <div className="mobile-frame" style={{ background: '#fff', overflow: 'hidden' }}>
      <StatusBar />

      <div style={{ padding: '19px 24px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button type="button" className="icon-btn" aria-label="Back" onClick={goBack}>←</button>
          <span style={{ fontSize: 20, fontWeight: 500, color: '#49493d' }}>Your trips</span>
        </div>
        <button
          type="button"
          className="secondary-btn"
          onClick={switchToPast}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 20, fontSize: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #eee',
          }}
        >
          <span>Upcoming</span> <span style={{ fontSize: 10, opacity: 0.7 }}>▼</span>
        </button>
      </div>

      {hasUpcoming ? (
        <div style={{ padding: '0 0 8px' }}>
          <div style={{ margin: '8px 24px 12px', fontSize: 12, color: '#6E6A61', textAlign: 'center' }}>
            Live from demo state — {upcomingFromBooked.length + (activeTrip ? 1 : 0)} upcoming/in-progress
          </div>

          {/* Active focused trip first (if present) */}
          {activeTrip && (activeTrip.status === 'upcoming' || activeTrip.status === 'in-progress') && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 10, color: '#c9a00e', marginBottom: 4, paddingLeft: 28, fontWeight: 600, letterSpacing: 0.4 }}>
                CURRENT FOCUS
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

          {/* All other booked upcoming */}
          {upcomingFromBooked
            .filter(t => !activeTrip || t.id !== activeTrip.id)
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
                  onClick={() => {
                    onNavigate?.('trip-upcoming');
                  }}
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
            style={{ margin: '12px 24px 20px', width: 'calc(100% - 48px)', padding: '14px', height: 48 }}
          >
            View active trip details
          </button>
        </div>
      ) : (
        <>
          {/* Empty state — intentional map mock + CTAs */}
          <div
            className="map-mock"
            style={{
              margin: '24px auto 0', width: 327, height: 175, position: 'relative',
              borderRadius: 16, overflow: 'hidden', border: '1px solid #eee',
            }}
          >
            <div className="map-mock-grid" />
            <div style={{ position: 'absolute', top: 20, left: 20, fontSize: 60, opacity: 0.12 }}>🗺️</div>
            <div style={{ position: 'absolute', top: 40, right: 40, fontSize: 42 }}>📱</div>
            <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', fontSize: 28 }}>📍</div>
            <div style={{ position: 'absolute', bottom: 50, right: 30, width: 60, height: 60, border: '2px solid #fecc2a', borderRadius: '50%', opacity: 0.55 }} />
          </div>

          <p style={{ margin: '48px 24px 0', fontSize: 20, fontWeight: 500, color: '#49493d', textAlign: 'center' }}>
            You have no upcoming trips!
          </p>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#959595', marginTop: 8, padding: '0 32px', lineHeight: 1.45 }}>
            Book a ride from Home or Choose Car to see it here.
          </p>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              addRecentAction('Book from empty upcoming trips');
              onNavigate?.('core-home');
            }}
            style={{ margin: '28px 24px 0', width: 'calc(100% - 48px)', height: 48 }}
          >
            Book a ride
          </button>
        </>
      )}

      <HomeIndicator />
    </div>
  );
};

export default YourTripsUpcomingPage;
