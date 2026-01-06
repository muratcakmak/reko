/**
 * Time Event Types for Reko
 *
 * Events are categorized into three types:
 * - countdown: Time remaining until a future date ("Left")
 * - since: Time elapsed since a past date ("Since")
 * - ahead: Future milestones and intentions ("Ahead")
 */

export type EventType = "countdown" | "since" | "ahead";

export interface TimeEvent {
  id: string;
  title: string;
  type: EventType;
  targetDate: string; // ISO date string
  createdAt: string;  // ISO date string
  color?: string;     // Optional custom color for the liquid
  icon?: string;      // Optional SF Symbol name
}

export interface CountdownEvent extends TimeEvent {
  type: "countdown";
}

export interface SinceEvent extends TimeEvent {
  type: "since";
  milestones?: Milestone[];
}

export interface AheadEvent extends TimeEvent {
  type: "ahead";
  priority?: "low" | "medium" | "high";
}

export interface Milestone {
  id: string;
  title: string;
  daysFromStart: number;
  achieved: boolean;
}

// Time calculation utilities
export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  percentage: number; // 0-1, representing completion/remaining
}

export interface TimeElapsed {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}
