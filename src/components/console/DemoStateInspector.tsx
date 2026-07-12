import React, { useState } from 'react';
import { useDemoState } from '../../context/DemoStateContext';

export const DemoStateInspector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const state = useDemoState();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="demo-inspector-fab"
        title="Toggle Demo State Inspector"
      >
        Demo state
      </button>

      {open && (
        <div className="demo-inspector-panel">
          <div style={{ fontWeight: 650, marginBottom: 10, color: 'var(--gody-amber-bright)', letterSpacing: '-0.01em' }}>
            Live demo state
          </div>
          <div>
            User: <strong>{state.user.name}</strong>{' '}
            <span style={{ opacity: 0.55, fontSize: 10 }}>{state.user.phone}</span>
          </div>
          <div style={{ marginTop: 4 }}>
            Payment: <strong>{state.selectedPayment.label}</strong>
          </div>
          {state.activeTrip ? (
            <div
              style={{
                marginTop: 8,
                padding: '8px 10px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 10,
                fontSize: 11,
                border: '1px solid var(--lab-border)',
              }}
            >
              <div style={{ color: 'var(--gody-amber-bright)', fontWeight: 600, marginBottom: 2 }}>Active trip</div>
              <div>
                <strong>{state.activeTrip.from}</strong> → <strong>{state.activeTrip.to}</strong>
              </div>
              <div style={{ opacity: 0.85, marginTop: 2 }}>
                {state.activeTrip.status} · {state.activeTrip.vehicle || 'Ride'} · $
                {state.activeTrip.price || '?'} · {state.activeTrip.eta || '—'}
                {state.activeTrip.driver && ` · ${state.activeTrip.driver}`}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 4, opacity: 0.6 }}>Active trip: none</div>
          )}
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.85 }}>
            Booked trips: <strong style={{ color: 'var(--gody-amber-bright)' }}>{state.bookedTrips.length}</strong>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.65, lineHeight: 1.4 }}>
            Recent: {state.recentActions.slice(0, 3).join(' · ') || '—'}
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            <button
              type="button"
              className="lab-btn"
              style={{ flex: 1, fontSize: 10, padding: '6px 6px' }}
              onClick={() => {
                if (typeof state.clearBookedTrips === 'function') state.clearBookedTrips();
              }}
            >
              Clear trips
            </button>
            <button
              type="button"
              className="lab-btn lab-btn--danger"
              style={{ flex: 1, fontSize: 10, padding: '6px 6px' }}
              onClick={state.resetDemoState}
            >
              Full reset
            </button>
          </div>
        </div>
      )}
    </>
  );
};
