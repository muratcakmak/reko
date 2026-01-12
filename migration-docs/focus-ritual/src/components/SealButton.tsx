import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SealButtonProps {
  onBreak: () => void;
  disabled?: boolean;
}

const SealButton = ({ onBreak, disabled }: SealButtonProps) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleStart = useCallback(() => {
    if (disabled) return;
    setIsHolding(true);
    startTimeRef.current = Date.now();
    
    intervalRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / 2000, 1); // 2 seconds to break
      setProgress(newProgress);
      
      if (newProgress >= 1) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        onBreak();
        setProgress(0);
        setIsHolding(false);
      }
    }, 16);
  }, [disabled, onBreak]);

  const handleEnd = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
    setIsHolding(false);
    startTimeRef.current = null;
  }, []);

  return (
    <button
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
      onPointerCancel={handleEnd}
      disabled={disabled}
      className={cn(
        'relative flex items-center justify-center w-12 h-12 rounded-full transition-all',
        'bg-secondary text-muted-foreground',
        isHolding && 'scale-95',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity={0.2}
        />
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="hsl(var(--destructive))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={125.6}
          strokeDashoffset={125.6 * (1 - progress)}
          initial={false}
        />
      </svg>
      <Lock className="w-4 h-4" />
    </button>
  );
};

export default SealButton;
