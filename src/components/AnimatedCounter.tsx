import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) {
      setCount(value);
      previousValueRef.current = value;
      return;
    }

    let startTimestamp: number | null = null;
    const startValue = previousValueRef.current;
    const endValue = value;
    const duration = 500; // Fast, elegant duration (500ms)

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Elegant cubic ease-out easing curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeProgress;
      setCount(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        previousValueRef.current = value;
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  const formatted = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return <span>{prefix}{formatted}{suffix}</span>;
}
