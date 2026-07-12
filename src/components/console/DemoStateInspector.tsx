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
        title="切换演示状态检查器"
      >
        演示状态
      </button>

      {open && (
        <div className="demo-inspector-panel">
          <div style={{ fontWeight: 650, marginBottom: 10, color: 'var(--gody-amber-bright)', letterSpacing: '-0.01em' }}>
            实时演示状态
          </div>
          <div>
            用户： <strong>{state.user.name}</strong>{' '}
            <span style={{ opacity: 0.55, fontSize: 10 }}>{state.user.phone}</span>
          </div>
          <div style={{ marginTop: 4 }}>
            支付： <strong>{state.selectedPayment.label}</strong>
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
              <div style={{ color: 'var(--gody-amber-bright)', fontWeight: 600, marginBottom: 2 }}>当前行程</div>
              <div>
                <strong>{state.activeTrip.from}</strong> → <strong>{state.activeTrip.to}</strong>
              </div>
              <div style={{ opacity: 0.85, marginTop: 2 }}>
                {state.activeTrip.status} · {state.activeTrip.vehicle || '行程'} · ¥
                {state.activeTrip.price || '?'} · {state.activeTrip.eta || '—'}
                {state.activeTrip.driver && ` · ${state.activeTrip.driver}`}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 4, opacity: 0.6 }}>当前行程：无</div>
          )}
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.85 }}>
            已预订行程： <strong style={{ color: 'var(--gody-amber-bright)' }}>{state.bookedTrips.length}</strong>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.65, lineHeight: 1.4 }}>
            最近： {state.recentActions.slice(0, 3).join(' · ') || '—'}
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
              清空行程
            </button>
            <button
              type="button"
              className="lab-btn lab-btn--danger"
              style={{ flex: 1, fontSize: 10, padding: '6px 6px' }}
              onClick={state.resetDemoState}
            >
              全部重置
            </button>
          </div>
        </div>
      )}
    </>
  );
};
