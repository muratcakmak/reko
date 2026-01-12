# Odak — Product Specification

## Philosophy

Odak is a Pomodoro-style focus timer built on four core principles:

1. **Time as texture** — Dot grids visualize time; one dot = one minute. No anxiety-inducing countdowns.
2. **Hold to start** — A 2.5s commitment threshold prevents accidental starts and creates ritual.
3. **Break the seal** — High-friction quit (2s long-press + confirm) maintains focus integrity.
4. **Local-first** — All data stays on device. No accounts, no sync, no tracking.

---

## Core User Flow

```
┌──────────┐     hold 2.5s      ┌──────────┐     time up       ┌──────────┐
│   IDLE   │ ─────────────────▶ │ FOCUSING │ ───────────────▶ │  BREAK   │
│          │                    │          │                   │          │
│ [select  │                    │ [dots    │                   │ [orange  │
│  preset] │                    │  decay]  │                   │  mode]   │
└──────────┘                    └──────────┘                   └──────────┘
     ▲                               │                              │
     │                               │ break seal                   │ break ends
     │                               ▼                              │
     │                          ┌──────────┐                        │
     └──────────────────────────│  ENDED   │◀───────────────────────┘
                                │  EARLY   │
                                └──────────┘
```

1. **Select preset**: Quick (10) / Standard (25) / Deep (50)
2. **Hold anywhere** to commit (2.5s threshold)
3. **Dot grid decays** during focus (1 dot/minute)
4. **Focus ends** → optional auto-break (5 min)
5. **Completed sessions** deposit to Bank

---

## Features

### Focus Timer
| Feature | Description |
|---------|-------------|
| **Presets** | Quick (10 min, 2×5 grid), Standard (25 min, 5×5 grid), Deep (50 min, 5×10 grid) |
| **Dot decay** | One dot extinguishes per minute, left-to-right, top-to-bottom |
| **Minutes toggle** | Optional small minutes remaining (user preference) |
| **No pause** | By design — commitment is absolute |

### Break
| Feature | Description |
|---------|-------------|
| **Duration** | Default 5 minutes (1×5 grid) |
| **Visual mode** | Full orange background, white dots |
| **Auto-start** | Optional in settings |
| **Skip** | Long-press seal to skip break |

### Bank
| Feature | Description |
|---------|-------------|
| **Sessions** | All completed focus sessions |
| **Grouping** | By day (today first) |
| **Data** | Duration, preset, timestamp |
| **Persistence** | Survives app restart |

### Settings
| Feature | Description |
|---------|-------------|
| **Duration customization** | Edit preset durations |
| **Auto-break toggle** | Start break automatically |
| **Show minutes toggle** | Display remaining minutes |
| **Sound/vibration** | Haptic feedback on completion |
| **Export/import** | JSON backup of sessions |

---

## Design Language

Odak inherits the **Rekoll visual system**:

### Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| **Background** | `#FFFFFF` | `#000000` | App background |
| **Surface** | `#F2F2F7` | `#111111` | Cards, inputs |
| **Accent (Orange)** | `#FF9500` | `#FF9F0A` | Primary action, focus dots |
| **Text Primary** | `#000000` | `#FFFFFF` | Headings, values |
| **Text Secondary** | `rgba(0,0,0,0.6)` | `rgba(255,255,255,0.6)` | Labels, hints |

### Dot States
| State | Light | Dark |
|-------|-------|------|
| **Active** | Orange `#FF9500` | Orange `#FF9F0A` |
| **Inactive** | Gray `#D1D1D6` | Gray `#3A3A3C` |
| **Charging** | Light orange (animated) | Light orange (animated) |
| **Break** | White on orange | White on orange |

### Typography
- **iOS**: San Francisco
- **Web**: Inter
- **Weights**: 100 (ultralight) to 700 (bold)

### Spacing
8px baseline grid:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

### Radius
- **Cards**: 16px (1rem)
- **Buttons**: 24px
- **Dots**: Full circle

---

## Accessibility

### Required
- [ ] VoiceOver-friendly alternative to long-press gestures
- [ ] Respect `prefers-reduced-motion` (disable dot animations)
- [ ] Respect Large Text / Dynamic Type
- [ ] Minimum 4.5:1 contrast ratio for text

### Gestures
| Gesture | Default | Accessible Alternative |
|---------|---------|----------------------|
| Hold to start | 2.5s long-press | "Start" button (VoiceOver only) |
| Break seal | 2s long-press | Focus + Space/Enter |

---

## Notifications

### When
- Focus end
- Break end

### Rules
- Only request permission when user enables in Settings
- Schedule at `endsAt` timestamp
- Cancel pending on early end

---

## Widgets

### Small (systemSmall)
- Dot grid only
- Current phase label

### Medium (systemMedium)
- Dot grid + next session / weekly goal progress

### Rules
- Never show noisy seconds
- Consistent with in-app dot motif
- Update per-minute (not per-second)

---

## Success Metrics

### Core
- Sessions completed per day
- Session completion rate (completed / started)
- Average session length

### Engagement
- Days active per week
- Bank growth over time

---

## Out of Scope (v1)

- Cloud sync / accounts
- Social features
- Analytics dashboard
- Custom durations beyond preset editing
- Multiple concurrent timers
