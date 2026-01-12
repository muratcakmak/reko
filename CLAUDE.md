# Claude.md — Odak Repo Assistant Guide

You are working inside the **Odak** repository (a Pomodoro-style focus app). Your job is to help implement features and refactors while preserving the product philosophy:

- **Time as texture** (dot grids, minimal digits)
- **Hold to start** (commitment threshold)
- **High-friction quit** (break the seal)
- **Local-first** (persist sessions and settings locally)

## Working agreements
### Do not change product philosophy without proposing alternatives
If you think a change is beneficial (e.g., adding a big countdown), propose it as an option and keep the default philosophy intact.

### Prefer deterministic time calculations
Never rely on a per-second timer loop as the source of truth.
Use timestamps (`startedAt`, `endsAt`) and compute remaining time from `now`.

### Keep UI minimal and consistent with Rekoll language
- White surfaces, generous whitespace
- One consistent orange accent
- Rounded cards
- Dot-grid visual motif
Avoid “Apple marketing” imitation; keep it product-first.

---

## Implementation rules
### State machine first
If adding new behaviors, update:
1) domain state machine
2) persistence model
3) UI wiring
4) tests

### Accessibility is not optional
- Provide VoiceOver-friendly alternatives to long-press / hold gestures
- Respect Reduce Motion and Large Text

### Persistence and migrations
- Every persisted payload must include a `version`
- If schema changes: write migration logic or fallback behavior
- Never silently drop user history

---

## What to do when you’re unsure
- Search in-repo for related patterns before inventing new architecture.
- Ask for one clarifying detail only if absolutely required; otherwise implement a sensible default and document it.

---

## Code style conventions
(Adjust these to match the actual repo conventions once you inspect it.)


### TypeScript (if RN/Web)
- Use strict types, no `any`
- Keep timer engine in `domain/`
- Use localStorage (web) / AsyncStorage (RN) behind a storage interface


---

## Definition of done (for any PR)
- Feature matches PRODUCT.md behavior
- Works on small phones (layout)
- Works after app restart
- Includes tests for critical logic
- Includes a short note in `Docs/DECISIONS.md` if it changes behavior

---

## Quick product glossary
- **Focus**: active commitment block (10/25/50)
- **Break**: release block (default 5)
- **Bank**: historical completed focus sessions
- **Seal**: high-friction stop control
- **Decaying Grid**: dot grid extinguishing per minute

---

## Helpful references
- `PRODUCT.md` — scope and philosophy
- `ENGINEERING.md` — architecture and system constraints
- `Docs/QA_CHECKLIST.md` — manual test cases (create if missing)
