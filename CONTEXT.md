# Volume — Domain Glossary

## Activity Type

One of four training categories a climber can schedule: `climbing`, `conditioning`, `mobility`, `warmup`.

Each activity type has a canonical configuration record (`ActivityTypeConfig`) that owns:
- **color** — the accent hex used everywhere the type is visually represented
- **pickerLabel** — the label shown in the "Add Activity" category picker (e.g. "Climbing Session")
- **summaryLabel** — the shorter label used in the load summary bar and detail panel (e.g. "Climbing")

The authoritative source for this metadata is `src/data/activityTypeConfig.ts`. Adding a new activity type means adding one entry there; all consumers derive from it.

## Activity

A scheduled training event owned by a user. Has a type, title, optional intent (climbing only), optional duration, and an accent color derived from its type.

## Week

A Monday-anchored 7-day period. Activities are grouped and displayed by week. The week's start date (`weekMonday`) is the primary key used to fetch and display activities.

## Load Summary

An aggregated view of a week's activities vs. user-set targets, one entry per activity type. Produced by `getWeekSummary` in `src/utils/weekSummary.ts`.

## Intent

A node in the skill tree that a climbing session is tagged with, representing the climber's focus for that session (e.g. a specific technique or area of the tree).

## Goal

A user-selected area of the skill tree that they are actively training toward. Up to 3 goals can be active at once. Goals are currently held in memory only (no persistence).
