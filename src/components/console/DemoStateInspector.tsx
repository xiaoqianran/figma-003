import React, { useState } from 'react';
import { useDemoState } from '../../context/DemoStateContext';

export const DemoStateInspector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const state = useDemoState();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 20, left: 20, zIndex: 9997,
          background: '#1A1916', border: '1px solid #2A2926', color: '#fecc2a',
          fontSize: 11, padding: '6px 10px', borderRadius: 999, cursor: 'pointer',
          fontFamily: 'IBM Plex Mono, monospace'
        }}
        title="Toggle Demo State Inspector"
      >
        DEMO STATE
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 60, left: 20, zIndex: 9997,
          background: '#11110F', border: '1px solid #2A2926', borderRadius: 12,
          padding: 16, width: 280, fontSize: 12, color: '#EDEBE5', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#fecc2a' }}>Demo State (Live)</div>
          <div>User: <strong>{state.user.name}</strong> <span style={{opacity:0.6,fontSize:10}}>{state.user.phone}</span></div>
          <div>Payment: <strong>{state.selectedPayment.label}</strong></div>
          {state.activeTrip ? (
            <div style={{ marginTop: 6, padding: '6px 8px', background: '#1A1916', borderRadius: 6, fontSize: 11 }}>
              <div style={{ color: '#fecc2a', fontWeight: 600, marginBottom: 2 }}>🚗 Active Trip</div>
              <div><strong>{state.activeTrip.from}</strong> → <strong>{state.activeTrip.to}</strong></div>
              <div style={{ opacity: 0.85, marginTop: 2 }}>
                {state.activeTrip.status} · {state.activeTrip.vehicle || 'Ride'} · ${state.activeTrip.price || '?'} · {state.activeTrip.eta || '—'}
                {state.activeTrip.driver && ` · ${state.activeTrip.driver}`}
              </div>
              <div style={{ fontSize: 9, opacity: 0.5, marginTop: 1 }}>ID: {state.activeTrip.id}</div>
            </div>
          ) : (
            <div>Active Trip: <span style={{opacity:0.6}}>None</span></div>
          )}
          <div style={{ marginTop: 6, fontSize: 11, opacity: 0.85 }}>
            Booked Trips: <strong style={{color:'#fecc2a'}}>{state.bookedTrips.length}</strong> (upcoming + history)
          </div>
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7 }}>
            Recent ({state.recentActions.length}): {state.recentActions.slice(0,3).join(' • ') || '—'}
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <button
              onClick={() => {
                if (typeof state.clearBookedTrips === 'function') state.clearBookedTrips();
              }}
              style={{ flex: 1, padding: '6px 8px', background: '#2A2926', color: '#EDEBE5', border: 'none', borderRadius: 6, fontSize: 10, cursor: 'pointer' }}
            >
              Clear Bookings
            </button>
            <button
              onClick={state.resetDemoState}
              style={{ flex: 1, padding: '6px 8px', background: '#C53D3D', color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, cursor: 'pointer' }}
            >
              Full Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
};
