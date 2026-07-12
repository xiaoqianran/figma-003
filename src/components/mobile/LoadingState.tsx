import React from 'react';

export interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean; // when used inside mobile-frame
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode; // custom content below spinner
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = '加载中...',
  fullScreen = false,
  size = 'md',
  className = '',
  children,
}) => {
  const spinnerSize = size === 'sm' ? 28 : size === 'lg' ? 56 : 42;

  const content = (
    <>
      <div
        className="loading-spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: size === 'sm' ? 2 : 3,
        }}
      />
      {message && <div className="loading-text" style={{ fontSize: size === 'sm' ? 12 : 14 }}>{message}</div>}
      {children}
    </>
  );

  if (fullScreen) {
    return (
      <div className={`loading-overlay ${className}`} style={{ position: 'absolute', inset: 0, borderRadius: 20 }}>
        {content}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      {content}
    </div>
  );
};

export default LoadingState;