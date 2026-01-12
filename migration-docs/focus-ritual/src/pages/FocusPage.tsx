import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerContext } from '@/contexts/TimerContext';
import DotGrid from '@/components/DotGrid';
import PresetSelector from '@/components/PresetSelector';
import SealButton from '@/components/SealButton';
import { getPresetGrid, getPresetDuration } from '@/hooks/useTimer';
import { cn } from '@/lib/utils';

const FocusPage = () => {
  const {
    state,
    preset,
    setPreset,
    settings,
    remainingSeconds,
    chargeProgress,
    dotsRemaining,
    totalDots,
    startCharging,
    updateCharge,
    completeCharge,
    cancelCharge,
    breakSeal,
    skipBreak,
  } = useTimerContext();

  const chargeIntervalRef = useRef<number | null>(null);
  const grid = getPresetGrid(preset);
  const duration = getPresetDuration(preset, settings);
  const breakGrid = { rows: 1, cols: settings.breakDuration };

  const handlePointerDown = useCallback(() => {
    if (state === 'idle') {
      startCharging();
      chargeIntervalRef.current = window.setInterval(() => {
        const progress = updateCharge();
        if (progress >= 1) {
          if (chargeIntervalRef.current) {
            clearInterval(chargeIntervalRef.current);
            chargeIntervalRef.current = null;
          }
          completeCharge();
        }
      }, 16);
    }
  }, [state, startCharging, updateCharge, completeCharge]);

  const handlePointerUp = useCallback(() => {
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      chargeIntervalRef.current = null;
    }
    if (state === 'charging') {
      cancelCharge();
    }
  }, [state, cancelCharge]);

  useEffect(() => {
    return () => {
      if (chargeIntervalRef.current) {
        clearInterval(chargeIntervalRef.current);
      }
    };
  }, []);

  const isIdle = state === 'idle';
  const isCharging = state === 'charging';
  const isRunning = state === 'running';
  const isBreak = state === 'break';

  const formatMinutes = (seconds: number) => {
    const mins = Math.ceil(seconds / 60);
    return `${mins} min`;
  };

  return (
    <motion.div
      className={cn(
        'min-h-screen flex flex-col transition-colors duration-500',
        isBreak ? 'bg-break' : 'bg-background'
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        <h1 className={cn(
          'text-xl font-semibold transition-colors',
          isBreak ? 'text-break-foreground' : 'text-foreground'
        )}>
          {isBreak ? 'Break Time' : 'Focus'}
        </h1>
        {(isRunning || isBreak) && (
          <SealButton 
            onBreak={isBreak ? skipBreak : breakSeal} 
            disabled={isIdle || isCharging}
          />
        )}
      </header>

      {/* Preset selector */}
      <AnimatePresence>
        {isIdle && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-6 mb-8"
          >
            <PresetSelector
              value={preset}
              onChange={setPreset}
              disabled={!isIdle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main grid area */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <AnimatePresence mode="wait">
          {isBreak ? (
            <motion.div
              key="break-grid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-8"
            >
              <DotGrid
                rows={breakGrid.rows}
                cols={breakGrid.cols}
                activeDots={dotsRemaining}
                isBreak
                className="max-w-xs"
              />
              {settings.showMinutesRemaining && (
                <p className="text-break-foreground/80 text-sm">
                  {formatMinutes(remainingSeconds)} remaining
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="focus-grid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-8"
            >
              <DotGrid
                rows={grid.rows}
                cols={grid.cols}
                activeDots={isIdle || isCharging ? 0 : dotsRemaining}
                isCharging={isCharging}
                chargeProgress={chargeProgress}
                className={cn(
                  'w-full max-w-xs',
                  preset === 'deep' && 'max-w-md'
                )}
              />
              
              {/* Hint text */}
              <AnimatePresence>
                {isIdle && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground text-center"
                  >
                    Hold anywhere to commit
                  </motion.p>
                )}
                {isCharging && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-primary text-center font-medium"
                  >
                    Keep holding...
                  </motion.p>
                )}
                {isRunning && settings.showMinutesRemaining && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-muted-foreground text-sm"
                  >
                    {formatMinutes(remainingSeconds)} remaining
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="px-6 pb-24 text-center">
        {(isRunning || isBreak) && (
          <p className={cn(
            'text-xs',
            isBreak ? 'text-break-foreground/60' : 'text-muted-foreground'
          )}>
            Hold the lock to {isBreak ? 'skip' : 'stop'}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default FocusPage;
