# Odak — Decisions

## 2026-01-XX — Countdown visibility
**Decision:** Default UI hides prominent countdown; optional small minutes remaining is user-toggle.
**Why:** Reduces anxiety and checking; preserves “time as texture.”
**Tradeoff:** Some users prefer explicit numbers; we provide an opt-in.

## 2026-01-XX — Timer truth
**Decision:** Timer truth is derived from timestamps (startedAt/endsAt), not tick loops.
**Why:** Reliable across background/restart; deterministic.

## 2026-01-XX — High-friction quit
**Decision:** No pause button by default; long-press seal + confirm.
**Why:** Maintains commitment ritual; reduces casual abandonment.
