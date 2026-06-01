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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span onClick={goBack} style={{ fontSize: 18, cursor: 'pointer' }}>←</span>
          <span style={{ fontSize: 20, fontWeight: 500, color: '#49493d' }}>Your trips</span>
        </div>
        <div onClick={switchToPast} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 16px', borderRadius: 20, background: '#fff', boxShadow: '0 4px 40px rgba(0,0,0,0.05)', fontSize: 12, cursor: 'pointer' }}>
          <span>Upcoming</span> <span>▼</span>
        </div>
      </div>

      {hasUpcoming ? (
        <div style={{ padding: '0 24px' }}>
          <div style={{ margin: '8px 0 12px', fontSize: 12, color: '#6E6A61', textAlign: 'center' }}>
            Live from demo state — {upcomingFromBooked.length + (activeTrip ? 1 : 0)} upcoming/in-progress
          </div>

          {/* Active focused trip first (if present) */}
          {activeTrip && (activeTrip.status === 'upcoming' || activeTrip.status === 'in-progress') && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: '#fecc2a', marginBottom: 4, paddingLeft: 4 }}>CURRENT FOCUS</div>
              <TripCard
                status={activeTrip.status === 'in-progress' ? 'in-progress' : 'upcoming'}
                title={`${activeTrip.vehicle || 'Ride'} to ${activeTrip.to}`}
                time={`${activeTrip.eta || 'Today'} · ${activeTrip.from || ''} → ${activeTrip.to}`}
                from={activeTrip.from || 'Current location'}
                to={activeTrip.to}
                price={activeTrip.price ? String(activeTrip.price) : undefined}
                driver={activeTrip.driver}
                onClick={() => onNavigate?.('trip-upcoming')}
              />
            </div>
          )}

          {/* All other booked upcoming */}
          {upcomingFromBooked
            .filter(t => !activeTrip || t.id !== activeTrip.id)
            .map((trip) => (
              <div key={trip.id} style={{ marginBottom: 10 }}>
                <TripCard
                  status={trip.status === 'in-progress' ? 'in-progress' : 'upcoming'}
                  title={`${trip.vehicle || 'Ride'} to ${trip.to}`}
                  time={`${trip.eta || 'Scheduled'} · ${trip.from} → ${trip.to}`}
                  from={trip.from}
                  to={trip.to}
                  price={trip.price ? String(trip.price) : undefined}
                  driver={trip.driver}
                  onClick={() => {
                    // Focus this trip as active when tapped from list
                    // (no direct setter for arbitrary, but we can nav to detail which will use it)
                    onNavigate?.('trip-upcoming');
                  }}
                />
              </div>
            ))}

          <button
            onClick={() => {
              addRecentAction('Viewed upcoming trip details');
              onNavigate?.('trip-upcoming');
            }}
            style={{ margin: '12px 0 20px', width: '100%', padding: '12px', background: '#fecc2a', border: 'none', borderRadius: 12, fontWeight: 600, color: '#0A0908' }}
          >
            View active trip details
          </button>
        </div>
      ) : (
        <>
          {/* Empty state unchanged */}
          <div style={{ margin: '24px auto 0', width: 327, height: 175, position: 'relative', background: '#f8f9fa', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 20, left: 20, fontSize: 60, opacity: 0.15 }}>🗺️</div>
            <div style={{ position: 'absolute', top: 40, right: 40, fontSize: 42 }}>📱</div>
            <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', fontSize: 28 }}>📍</div>
            <div style={{ position: 'absolute', bottom: 50, right: 30, width: 60, height: 60, border: '2px solid #fecc2a', borderRadius: '50%', opacity: 0.6 }} />
          </div>

          <p style={{ margin: '83px 24px 0', fontSize: 20, fontWeight: 500, color: '#49493d', textAlign: 'center' }}>
            You have no upcoming trips!
          </p>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#959595', marginTop: 8 }}>
            Book a ride from Home or Choose Car to see it here.
          </p>
        </>
      )}

      <HomeIndicator />
    </div>
  );
};

export default YourTripsUpcomingPage;
