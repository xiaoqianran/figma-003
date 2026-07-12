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
        title="运行旗舰标准叫车流程"
      >
        ▶ 模拟叫车
      </button>

      {onOpenFlowPresets && (
        <button type="button" onClick={onOpenFlowPresets} className="lab-btn" title="打开流程预设">
          预设
        </button>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowQuick((v) => !v)}
          className="lab-btn"
          title="实验室快捷工具"
        >
          操作 {showQuick ? '▴' : '▾'}
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
              { fn: onReset, label: '全部重置', icon: '↺' },
              { fn: onLoadDemoTrip, label: '加载演示行程', icon: '🚕' },
              { fn: onSeedMultiTrips, label: '填充 3 条示例行程', icon: '📦' },
              { fn: onExportDemoState, label: '导出演示状态', icon: '↓' },
              { fn: onImportDemoState, label: '导入演示状态', icon: '↑' },
              { fn: onJumpPopular, label: '跳转到选车页', icon: '★' },
              { fn: onSimulateFlow, label: '模拟叫车流程', icon: '▶' },
              { fn: onOpenFlowPresets, label: '浏览流程预设', icon: '☰' },
              { fn: onRandom, label: '随机原型', icon: '🎲' },
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
                <span className="text-[10px]">缩放</span>
                <button type="button" onClick={() => { onZoomChange(Math.max(0.55, zoom - 0.1)); closeQuick(); }} className="lab-btn" style={{ padding: '2px 8px' }}>−</button>
                <span className="text-[11px] tabular-nums">{zoom.toFixed(1)}×</span>
                <button type="button" onClick={() => { onZoomChange(Math.min(1.9, zoom + 0.1)); closeQuick(); }} className="lab-btn" style={{ padding: '2px 8px' }}>+</button>
              </div>
            )}
            {onRotate && (
              <button type="button" onClick={() => runQuick(onRotate)} className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5">
                {isRotated ? '↩︎' : '⟲'} 切换旋转
              </button>
            )}
          </div>
        )}
      </div>

      <button type="button" onClick={onRandom} className="lab-btn">随机</button>
      <button type="button" onClick={onReset} className="lab-btn">重置</button>
      {onExportDemoState && (
        <button type="button" onClick={onExportDemoState} className="lab-btn">导出</button>
      )}
      {onImportDemoState && (
        <button type="button" onClick={onImportDemoState} className="lab-btn">导入</button>
      )}
      <button type="button" onClick={toggle} className="lab-btn">
        {showFrame ? '隐藏边框' : '显示边框'}
      </button>

      {onCopyCurrentLink && (
        <button type="button" onClick={onCopyCurrentLink} className="lab-btn" title={selectedTitle ? `复制实验室链接：${selectedTitle}` : '复制链接'}>
          复制链接
        </button>
      )}
      {onCopyStandaloneLink && (
        <button type="button" onClick={onCopyStandaloneLink} className="lab-btn" title="复制独立预览链接">
          独立预览
        </button>
      )}

      {onZoomChange && typeof zoom === 'number' && !showQuick && (
        <span className="text-[11px] text-[var(--lab-text-muted)] tabular-nums ml-1">{zoom.toFixed(1)}×</span>
      )}
    </>
  );
};
