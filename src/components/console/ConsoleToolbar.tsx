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
  onSimulateFlow?: () => void;
  onLoadDemoTrip?: () => void;
  onJumpPopular?: () => void;
  onOpenFlowPresets?: () => void;
  onSeedMultiTrips?: () => void;
  onExportDemoState?: () => void;
  onImportDemoState?: () => void;
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
  onExportDemoState,
  onImportDemoState,
  zoom,
  onZoomChange,
  isRotated,
  onRotate,
}) => {
  const [showQuick, setShowQuick] = React.useState(false);

  const toggle = () => {
    if (onToggleFrame) onToggleFrame();
    else if (setShowFrame && typeof showFrame === 'boolean') setShowFrame(!showFrame);
  };

  const closeQuick = () => setShowQuick(false);

  const runQuick = (fn?: () => void) => {
    fn?.();
    setShowQuick(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={onSimulateFlow}
        className="lab-btn lab-btn--primary"
        title="Run the flagship Standard Booking Flow"
      >
        ▶ Simulate booking
      </button>

      {onOpenFlowPresets && (
        <button type="button" onClick={onOpenFlowPresets} className="lab-btn" title="Open flow presets">
          Presets
        </button>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowQuick((v) => !v)}
          className="lab-btn"
          title="Quick lab utilities"
        >
          Actions {showQuick ? '▴' : '▾'}
        </button>

        {showQuick && (
          <div
            className="absolute top-full left-0 mt-2 z-[999] rounded-2xl p-1.5 text-xs min-w-[260px]"
            style={{
              border: '1px solid var(--lab-border-strong)',
              boxShadow: 'var(--shadow-lg)',
              background: 'var(--lab-surface)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { fn: onReset, label: 'Reset everything', icon: '↺' },
              { fn: onLoadDemoTrip, label: 'Load demo trip', icon: '🚕' },
              { fn: onSeedMultiTrips, label: 'Seed 3 sample trips', icon: '📦' },
              { fn: onExportDemoState, label: 'Export demo state', icon: '↓' },
              { fn: onImportDemoState, label: 'Import demo state', icon: '↑' },
              { fn: onJumpPopular, label: 'Jump to Choose Car', icon: '★' },
              { fn: onSimulateFlow, label: 'Simulate booking flow', icon: '▶' },
              { fn: onOpenFlowPresets, label: 'Browse flow presets', icon: '☰' },
              { fn: onRandom, label: 'Random prototype', icon: '🎲' },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => runQuick(item.fn)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 text-[var(--lab-text)] flex items-center gap-2"
              >
                <span className="opacity-70 w-4 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {onZoomChange && typeof zoom === 'number' && (
              <div className="px-3 py-2 flex items-center gap-2 text-[var(--lab-text-muted)] border-t border-white/5 mt-1">
                <span className="text-[10px]">Zoom</span>
                <button type="button" onClick={() => { onZoomChange(Math.max(0.55, zoom - 0.1)); closeQuick(); }} className="lab-btn" style={{ padding: '2px 8px' }}>−</button>
                <span className="text-[11px] tabular-nums">{zoom.toFixed(1)}×</span>
                <button type="button" onClick={() => { onZoomChange(Math.min(1.9, zoom + 0.1)); closeQuick(); }} className="lab-btn" style={{ padding: '2px 8px' }}>+</button>
              </div>
            )}
            {onRotate && (
              <button type="button" onClick={() => runQuick(onRotate)} className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5">
                {isRotated ? '↩︎' : '⟲'} Toggle rotation
              </button>
            )}
          </div>
        )}
      </div>

      <button type="button" onClick={onRandom} className="lab-btn">Random</button>
      <button type="button" onClick={onReset} className="lab-btn">Reset</button>
      {onExportDemoState && (
        <button type="button" onClick={onExportDemoState} className="lab-btn">Export</button>
      )}
      {onImportDemoState && (
        <button type="button" onClick={onImportDemoState} className="lab-btn">Import</button>
      )}
      <button type="button" onClick={toggle} className="lab-btn">
        {showFrame ? 'Hide frame' : 'Show frame'}
      </button>

      {onCopyCurrentLink && (
        <button type="button" onClick={onCopyCurrentLink} className="lab-btn" title={selectedTitle ? `Copy lab link for ${selectedTitle}` : 'Copy link'}>
          Copy link
        </button>
      )}
      {onCopyStandaloneLink && (
        <button type="button" onClick={onCopyStandaloneLink} className="lab-btn" title="Copy standalone link">
          Standalone
        </button>
      )}

      {onZoomChange && typeof zoom === 'number' && !showQuick && (
        <span className="text-[11px] text-[var(--lab-text-muted)] tabular-nums ml-1">{zoom.toFixed(1)}×</span>
      )}
    </>
  );
};
