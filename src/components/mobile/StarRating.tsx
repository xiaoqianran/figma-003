import React, { useState } from 'react';

export interface StarRatingProps {
  value?: number;           // controlled value
  defaultValue?: number;    // uncontrolled
  max?: number;
  size?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  defaultValue = 0,
  max = 5,
  size = 28,
  onChange,
  readonly = false,
  showValue = false,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value !== undefined ? value : internalValue;

  const handleClick = (rating: number) => {
    if (readonly) return;
    const newVal = rating;
    if (value === undefined) {
      setInternalValue(newVal);
    }
    onChange?.(newVal);
  };

  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className={`star-rating ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {stars.map((n) => (
        <span
          key={n}
          onClick={() => handleClick(n)}
          className={`star ${n <= current ? 'filled' : ''}`}
          style={{
            fontSize: size,
            color: n <= current ? '#fecc2a' : '#e0e0e0',
            cursor: readonly ? 'default' : 'pointer',
            transition: 'transform 0.1s, color 0.1s'
          }}
          role="button"
          aria-label={`${n} star`}
        >
          {n <= current ? '★' : '☆'}
        </span>
      ))}
      {showValue && (
        <span style={{ marginLeft: 10, fontSize: 14, color: '#49493d', fontWeight: 500 }}>
          {current.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;