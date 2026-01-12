/**
 * Focus Presets
 *
 * Each preset defines duration and dot grid layout.
 * Grid dimensions: one dot = one minute.
 */

import type { PresetId } from '../types';

export interface Preset {
  id: PresetId;
  name: string;
  durationMinutes: number;
  gridRows: number;
  gridCols: number;
}

// Default presets per PRODUCT.md
export const PRESETS: Record<PresetId, Preset> = {
  quick: {
    id: 'quick',
    name: 'Quick',
    durationMinutes: 10,
    gridRows: 2,
    gridCols: 5,
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    durationMinutes: 25,
    gridRows: 5,
    gridCols: 5,
  },
  deep: {
    id: 'deep',
    name: 'Deep',
    durationMinutes: 50,
    gridRows: 10,
    gridCols: 5,
  },
};

// Break preset (not selectable, used for break phase)
export const BREAK_PRESET: Preset = {
  id: 'quick', // reuse quick for type compatibility
  name: 'Break',
  durationMinutes: 5,
  gridRows: 1,
  gridCols: 5,
};

/**
 * Get preset by ID
 */
export function getPreset(id: PresetId): Preset {
  return PRESETS[id];
}

/**
 * Get all presets as array (for UI selection)
 */
export function getAllPresets(): Preset[] {
  return Object.values(PRESETS);
}

/**
 * Calculate total dots for a preset
 */
export function getTotalDots(preset: Preset): number {
  return preset.gridRows * preset.gridCols;
}

/**
 * Calculate lit dots based on remaining minutes
 */
export function getLitDots(
  remainingMinutes: number,
  totalMinutes: number
): number {
  return Math.max(0, Math.min(totalMinutes, Math.ceil(remainingMinutes)));
}
