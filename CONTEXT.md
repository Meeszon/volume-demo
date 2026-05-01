# Volume — Domain Glossary

## Activity Type

One of four training categories a climber can schedule: `climbing`, `conditioning`, `mobility`, `warmup`.

Each activity type has a canonical configuration record (`ActivityTypeConfig`) that owns:
- **color** — the accent hex used everywhere the type is visually represented
- **pickerLabel** — the label shown in the "Add Activity" category picker (e.g. "Climbing Session")
- **summaryLabel** — the shorter label used in the load summary bar and detail panel (e.g. "Climbing")

The authoritative source for this metadata is `src/data/activityTypeConfig.ts`. Adding a new activity type means adding one entry there; all consumers derive from it.

## Activity

A scheduled training event owned by a user. Has a type, title, optional focus (climbing only), optional duration (climbing only), and an accent color derived from its type. Non-climbing activities carry structured exercise details in a `details` JSON blob.

## Week

A Monday-anchored 7-day period. Activities are grouped and displayed by week. The week's start date (`weekMonday`) is the primary key used to fetch and display activities.

## Load Summary

An aggregated view of a week's activities vs. user-set targets, one entry per activity type. Produced by `getWeekSummary` in `src/utils/weekSummary.ts`.

## Focus

An optional tag on a climbing session representing the climber's high-level training intent for that session. One of five fixed options: Endurance, Power, Technique, Footwork, Finger Strength. Stored as a string in the `focus` column (formerly `intent_node_id`). Not linked to the skill tree.

## Training Block

A non-climbing activity composed of multiple exercises, each with sets, a value (reps or seconds), and a rest period (seconds). Displayed on the schedule card with the block name as title and the exercise names as a truncated subtitle (separated by ·). Template data lives in `src/data/activityTemplates.ts`.

## Exercise

A single-movement non-climbing activity with sets, a value (reps or seconds), and a rest period (seconds). The unit (`reps` or `seconds`) is fixed per exercise in the template data. Displayed on the schedule card with the exercise name as title and "sets × value(unit)" as subtitle.

## Goal

A user-selected area of the skill tree that they are actively training toward. Up to 3 goals can be active at once. Goals are currently held in memory only (no persistence).
