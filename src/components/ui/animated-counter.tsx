'use client';

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  scaleDown?: number;
}

export function AnimatedCounter({ target, duration = 1500, prefix = "", suffix = "", decimals = 0, scaleDown = 1 }: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    
    const scaledTarget = target / scaleDown;
    const startTime = Date.now();
    const startValue = 0;
    const endValue = scaledTarget;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * eased;
      setValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [visible, target, duration, scaleDown]);

  const formattedValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  const displayValue = value === 0 && !visible ? "0" : formattedValue;

  return (
    <span>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
