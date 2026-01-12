import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SessionPreset } from '@/hooks/useTimer';

interface PresetSelectorProps {
  value: SessionPreset;
  onChange: (preset: SessionPreset) => void;
  disabled?: boolean;
}

const presets: { id: SessionPreset; label: string; minutes: string }[] = [
  { id: 'quick', label: 'Quick', minutes: '10' },
  { id: 'standard', label: 'Standard', minutes: '25' },
  { id: 'deep', label: 'Deep', minutes: '50' },
];

const PresetSelector = ({ value, onChange, disabled }: PresetSelectorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-secondary rounded-xl">
      {presets.map((preset) => {
        const isActive = preset.id === value;
        return (
          <button
            key={preset.id}
            onClick={() => !disabled && onChange(preset.id)}
            disabled={disabled}
            className={cn(
              'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              disabled && 'opacity-50 cursor-not-allowed',
              isActive ? 'text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="preset-bg"
                className="absolute inset-0 bg-primary rounded-lg shadow-soft"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PresetSelector;
