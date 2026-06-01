import React from 'react';

interface Props {
  onRandom?: () => void;
  onReset?: () => void;
  showFrame?: boolean;
  onToggleFrame?: (v?: boolean) => void;
  setShowFrame?: (v: boolean) => void;
  zoom?: number;
  onZoomChange?: (z: number) => void;
  setZoom?: (v: number) => void;
  isRotated?: boolean;
  onRotate?: () => void;
  onCopyCurrentLink?: () => void;
  onCopyStandaloneLink?: () => void;
  selectedTitle?: string;
  // Premium lab features
  onSimulateFlow?: () => void;
  onLoadDemoTrip?: () => void;
  onJumpPopular?: () => void;
  onOpenFlowPresets?: () => void;
  onSeedMultiTrips?: () => void;
}

export const ConsoleToolbar: React.FC<Props> = ({
  onRandom,
  onReset,
  showFrame,
  onToggleFrame,
  setShowFrame,
  onCopyCurrentLink,
  onCopyStandaloneLink,
  selectedTitle,
  onSimulateFlow,
  onLoadDemoTrip,
  onJumpPopular,
  onOpenFlowPresets,
  onSeedMultiTrips,
  zoom,
  onZoomChange,
  isRotated,
  onRotate,
}) => {
  const [showQuick, setShowQuick] = React.useState(false)

  const toggle = () => {
    if (onToggleFrame) onToggleFrame();
    else if (setShowFrame && typeof showFrame === 'boolean') setShowFrame(!showFrame);
  };

  const closeQuick = () => setShowQuick(false)

  const runQuick = (fn?: () => void) => {
    fn?.()
    setShowQuick(false)
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
      {/* PROMINENT: Flow Simulator — high value standout demo tool for stakeholders */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <button
          onClick={onSimulateFlow}
          className="tb-btn"
          style={{
            borderColor: '#fecc2a',
            color: '#fecc2a',
            padding: '5px 12px',
            fontWeight: 600,
            letterSpacing: '0.4px',
            background: 'linear-gradient(180deg, #1F1E1B 0%, #151410 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
          title="Quick-start the flagship Standard Booking Flow — a standout feature for live stakeholder demos"
        >
          <span style={{
            background: '#fecc2a',
            color: '#0A0908',
            fontSize: '8px',
            fontWeight: 800,
            padding: '1px 5px',
            borderRadius: '3px',
            letterSpacing: '0.6px',
            lineHeight: 1
          }}>DEMO</span>
          <span>▶ SIMULATE REALISTIC BOOKING FLOW</span>
        </button>
        {onOpenFlowPresets && (
          <button
            onClick={onOpenFlowPresets}
            className="tb-btn"
            style={{ padding: '5px 9px', fontSize: '10px', letterSpacing: '0.3px' }}
            title="Open Flow Simulator presets: Standard, Trip Mgmt, Account+Payment, Full E2E"
          >
            PRESETS
          </button>
        )}
      </div>

      {/* Global Quick Actions dropdown — premium lab power user tool */}
      <div className="relative" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
        <button
          onClick={() => setShowQuick(v => !v)}
          className="tb-btn flex items-center gap-1"
          title="Fast lab utilities: reset, demo data, jumps"
        >
          QUICK ACTIONS <span style={{ fontSize: '9px', opacity: 0.7 }}>{showQuick ? '▲' : '▼'}</span>
        </button>

        {showQuick && (
          <div
            className="metal absolute top-full left-0 mt-1 z-[999] rounded-xl p-1 text-xs min-w-[232px]"
            style={{
              border: '1px solid #2A2926',
              boxShadow: '0 16px 40px -10px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
              background: 'linear-gradient(#1A1916, #11110F)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => runQuick(onReset)} className="w-full text-left px-3 py-[7px] hover:bg-[#22211D] rounded-lg console-font text-[#EDEBE5] flex items-center gap-2">
              <span>↺</span> <span>Reset everything (console prefs + demo state)</span>
            </button>
            <button onClick={() => runQuick(onLoadDemoTrip)} className="w-full text-left px-3 py-[7px] hover:bg-[#22211D] rounded-lg console-font text-[#EDEBE5] flex items-center gap-2">
              <span>🚕</span> <span>Load demo trip (populate active state)</span>
            </button>
            <button onClick={() => runQuick(onSeedMultiTrips)} className="w-full text-left px-3 py-[7px] hover:bg-[#22211D] rounded-lg console-font text-[#EDEBE5] flex items-center gap-2" style={{ color: '#fecc2a' }}>
              <span>📦</span> <span>Seed 3 sample trips (new multi-trip demo)</span>
            </button>
            <button onClick={() => runQuick(onJumpPopular)} className="w-full text-left px-3 py-[7px] hover:bg-[#22211D] rounded-lg console-font text-[#EDEBE5] flex items-center gap-2">
              <span>★</span> <span>Jump to most popular page (Choose Car)</span>
            </button>

            <div style={{ height: 1, background: '#2A2926', margin: '5px 8px' }} />

            <button onClick={() => runQuick(onSimulateFlow)} className="w-full text-left px-3 py-[7px] hover:bg-[#22211D] rounded-lg console-font flex items-center gap-2" style={{ color: '#fecc2a' }}>
              <span>▶</span> <span>Simulate Realistic Booking Flow (Standard)</span>
            </button>
            <button onClick={() => runQuick(onOpenFlowPresets)} className="w-full text-left px-3 py-[7px] hover:bg-[#22211D] rounded-lg console-font text-[#EDEBE5] flex items-center gap-2">
              <span>📋</span> <span>Browse all Flow Simulator presets</span>
            </button>
            <button onClick={() => runQuick(onRandom)} className="w-full text-left px-3 py-[7px] hover:bg-[#22211D] rounded-lg console-font text-[#EDEBE5] flex items-center gap-2">
              <span>🎲</span> <span>Random prototype</span>
            </button>

            <div style={{ height: 1, background: '#2A2926', margin: '5px 8px' }} />

            {/* Simple zoom controls surfaced here too for completeness */}
            {onZoomChange && typeof zoom === 'number' && (
              <div className="px-3 py-1 flex items-center gap-1 text-[#B8B5B0]">
                <span className="console-font text-[10px] opacity-70 mr-1">ZOOM</span>
                <button onClick={() => { onZoomChange(Math.max(0.55, zoom - 0.1)); closeQuick() }} className="tb-btn" style={{ padding: '1px 6px', fontSize: 10 }}>-</button>
                <span className="console-font text-[10px] tabular-nums px-1">{zoom.toFixed(1)}×</span>
                <button onClick={() => { onZoomChange(Math.min(1.9, zoom + 0.1)); closeQuick() }} className="tb-btn" style={{ padding: '1px 6px', fontSize: 10 }}>+</button>
              </div>
            )}
            {onRotate && (
              <button onClick={() => runQuick(onRotate)} className="w-full text-left px-3 py-[7px] hover:bg-[#22211D] rounded-lg console-font text-[#EDEBE5]">
                {isRotated ? '↩︎' : '⟲'} Toggle device rotation
              </button>
            )}

            {/* Close hint */}
            <div className="px-3 pt-2 pb-1 text-[9px] text-[#6E6A61] console-font border-t border-[#2A2926] mt-1">Click action or button to close</div>
          </div>
        )}
      </div>

      {/* Core existing controls */}
      <button onClick={onRandom} className="tb-btn">Random</button>
      <button onClick={onReset} className="tb-btn">Reset State</button>
      <button onClick={toggle} className="tb-btn">
        {showFrame ? 'Hide Frame' : 'Show Frame'}
      </button>

      {/* Copy enhancements - Lab deep link + Standalone fullscreen link */}
      {onCopyCurrentLink && (
        <button
          onClick={onCopyCurrentLink}
          className="tb-btn"
          title={selectedTitle ? `Copy lab link for ${selectedTitle}` : 'Copy current deep link'}
        >
          Copy Link
        </button>
      )}
      {onCopyStandaloneLink && (
        <button
          onClick={onCopyStandaloneLink}
          className="tb-btn"
          title={selectedTitle ? `Copy standalone link for ${selectedTitle}` : 'Copy standalone fullscreen link'}
          style={{ borderColor: 'rgba(254,204,42,0.35)' }}
        >
          Copy Standalone
        </button>
      )}

      {/* Fallback simple zoom if no dropdown used */}
      {onZoomChange && typeof zoom === 'number' && !showQuick && (
        <span className="console-font text-[10px] text-[#6E6A61] ml-1 tabular-nums">{zoom.toFixed(1)}×</span>
      )}
    </div>
  );
};
