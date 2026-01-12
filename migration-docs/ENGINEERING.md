# Odak — Engineering

## Goals
- Build a reliable timer experience that works when the app is backgrounded.
- Keep architecture simple: local-first persistence, minimal dependencies.
- Match the Rekoll visual system: dot grids, rounded cards, orange accent.

## Assumed platforms
Primary: iOS (Expo RN) — based on Rekoll fork + screenshots  
Secondary (optional): Web/PWA (React) or React Native

This doc is written platform-agnostic with iOS-first implementation notes.

---

## High-level architecture
### Layers
1. **UI Layer**
   - Expo RN screens (Focus/Bank/Stats/You)
   - Stateless views driven by a single `AppState`
2. **Domain Layer**
   - Timer engine (focus/break state machine)
   - Session model + Bank aggregation
3. **Data Layer**
   - Local persistence (JSON store / CoreData / SQLite)
   - Export/import
4. **System Integration**
   - Notifications
   - Live Activities / Dynamic Island (iOS)
   - Widgets (iOS, optional)
   - Background handling

### Guiding principle
**Timer truth is derived from timestamps, not tick loops.**
- Store `startedAt`, `endsAt`, `phase` and compute remaining time from `now`.
- UI can animate, but state must be deterministic after app restarts.

---

## State machine
### Phases
- `idle`
- `holdingToStart` (transient UI state)
- `focusing`
- `break`
- `completed` (momentary)
- `endedEarly`

### Transitions
- `idle` → `holdingToStart` (press down)
- `holdingToStart` → `idle` (release before threshold)
- `holdingToStart` → `focusing` (threshold met)
- `focusing` → `break` (endsAt reached)
- `focusing` → `endedEarly` (break seal)
- `break` → `idle` (break ends) OR → `holdingToStart` (user commits again)

---

## Timer model
### Data you must persist
- `activeSessionId` (nullable)
- `ActiveTimerState`:
  - `phase: focus|break`
  - `presetId`
  - `startedAt`
  - `endsAt`
  - `totalMinutes`
  - `isAutoBreakEnabled` (can be global)
- `SessionHistory[]` (bank entries)

### Why timestamps matter
- Survives app termination.
- Survives background/foreground transitions.
- Lets widgets/live activities show accurate progress.

---

## Dot grid rendering
### Grid specs
- Quick: 10 min → 2x5
- Standard: 25 min → 5x5
- Deep: 50 min → 5x10

### Decay behavior
- One dot extinguishes per minute.
- Determine number of remaining dots:
  - `remainingMinutes = ceil((endsAt - now) / 60)`
  - `litDots = clamp(remainingMinutes, 0, totalMinutes)`
- Render dots in consistent order:
  - left-to-right, top-to-bottom

### Reduced motion
- If Reduce Motion enabled, remove flourish animations and do discrete state changes.

---

## Hold-to-start implementation
### iOS (Expo RN)
- Use a gesture that tracks press duration:
  - LongPressGesture(minimumDuration: threshold) for “commit”
  - Combine with DragGesture or onPressingChanged to show charging feedback
- UI feedback:
  - charging overlay progress (0 → 1)
  - dot “fill” animation

### React / Web
- Pointer events: `pointerdown`, `pointerup`, `pointercancel`
- Use `requestAnimationFrame` to update hold progress
- Must cancel on scroll / pointercancel

---

## “Break the seal” implementation
High-friction stop should not be accidental.

### iOS
- A small lock/seal control.
- Long-press 2s triggers confirmation sheet.

### Web
- Similar long-press with pointer events.
- Also offer keyboard accessible path (focus + space/enter triggers a confirm dialog).

---

## Persistence
### Recommended (iOS)
- Start simple: JSON file in Application Support or UserDefaults for small payloads.
- If you foresee growth: Core Data or SQLite.

### Required behaviors
- App relaunch must restore:
  - active timer state (if still running)
  - bank history
  - settings

### Export/Import
- Export:
  - `{ version, settings, sessions[] }`
- Import:
  - validate schema
  - merge or replace policy (default: replace)

---

## Notifications
### Focus end / Break end
- Only request permission when user enables notifications in Settings.
- Schedule at `endsAt`.
- If user ends early, cancel pending notifications.

### iOS specifics
- `UNUserNotificationCenter`
- Ensure notifications update when user edits durations mid-session (if allowed).

---

## Live Activities / Dynamic Island (iOS, optional but high impact)
### Live Activity content
- Phase (focus/break)
- EndsAt
- Minimal visuals:
  - mini dot grid or shrinking bar
- Update policy:
  - avoid per-second updates; per-minute is fine
  - rely on `endsAt` and system timeline when possible

---

## Widgets (optional)
- Small: dot grid + label
- Medium: dot grid + next scheduled / weekly goal progress

Widgets should:
- never show noisy seconds
- remain consistent with the in-app dot motif

---

## Accessibility
- Minimum contrast for text and key UI elements
- “Hold to start” must have an accessible alternative:
  - e.g. a small “Start” button only visible when VoiceOver is enabled
- Respect:
  - Reduce Motion
  - Larger Text
  - VoiceOver focus order

---

## Analytics (optional)
If you add analytics, keep it minimal and local-first friendly.

Events (privacy-safe):
- `app_open`
- `hold_started`, `hold_committed`
- `focus_started`, `focus_completed`, `focus_ended_early`
- `break_started`, `break_completed`
- `export_used`, `import_used`

Never log:
- user-entered text notes (if later added)
- precise timestamps unless needed (aggregate instead)

---

## Testing plan
### Unit tests
- Timer state machine transitions
- Remaining minutes → litDots calculation
- Persistence load/save + schema migration

### Integration tests
- App relaunch while focusing
- Background for 10+ minutes → correct state on return
- Notification scheduling/cancellation

### Manual QA (high risk)
- Holding gesture across edge cases (interruptions, calls, lock screen)
- Time changes (time zone shift, manual clock change) — handle gracefully by trusting elapsed time from timestamps
- Low power mode (don’t rely on frequent timers)

---

## Performance
- Dot grid should be cheap to render:
  - avoid heavy per-frame layout recalcs
  - use simple shapes / drawing groups
- No per-second timers for UI.
  - UI can tick per minute, or animate based on timeline.

---

## Build / Release checklist (engineering)
- Versioning: semver
- Migration: if schema changes, provide `version` field and a migration path
- Crash/bug logging (optional): keep it lightweight and opt-out

---

## Suggested repo structure (iOS)
- `OdakApp/`
  - `App/` (entry, state container)
  - `Features/Focus/`
  - `Features/Bank/`
  - `Features/Stats/`
  - `Features/You/`
  - `Domain/TimerEngine/`
  - `Domain/Models/`
  - `Data/Storage/`
  - `System/Notifications/`
  - `System/LiveActivities/` (optional)
  - `UI/Components/` (dot grid, cards, etc.)
- `Docs/` (these markdown files)
- `Tests/`

(For RN/Web, mirror the same domains: `features/`, `domain/`, `data/`, `system/`.)
