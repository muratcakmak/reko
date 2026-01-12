import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DotGridProps {
  rows: number;
  cols: number;
  activeDots: number;
  isBreak?: boolean;
  isCharging?: boolean;
  chargeProgress?: number;
  className?: string;
}

const DotGrid = ({
  rows,
  cols,
  activeDots,
  isBreak = false,
  isCharging = false,
  chargeProgress = 0,
  className,
}: DotGridProps) => {
  const totalDots = rows * cols;
  const chargedDots = isCharging ? Math.floor(chargeProgress * totalDots) : 0;

  return (
    <div
      className={cn('grid gap-3', className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: totalDots }).map((_, index) => {
        const isActive = index < activeDots;
        const isCharged = isCharging && index < chargedDots;
        const dotIndex = index;

        return (
          <motion.div
            key={index}
            initial={false}
            animate={{
              scale: isActive || isCharged ? 1 : 0.85,
              opacity: isActive ? 1 : isCharged ? 0.9 : 0.25,
            }}
            transition={{
              duration: 0.4,
              delay: isCharging ? index * 0.02 : 0,
              ease: 'easeOut',
            }}
            className={cn(
              'aspect-square rounded-full transition-colors duration-300',
              isBreak
                ? isActive
                  ? 'bg-break-foreground'
                  : 'bg-break-foreground/20'
                : isActive || isCharged
                ? 'bg-dot-active'
                : 'bg-dot-inactive'
            )}
            style={{
              width: '100%',
              maxWidth: cols > 5 ? '16px' : '20px',
            }}
          />
        );
      })}
    </div>
  );
};

export default DotGrid;
