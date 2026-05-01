# ADR 0001 — Store exercise details as a JSON blob

## Status
Accepted

## Context
Non-climbing activities (conditioning, mobility, warmup) now carry structured exercise data: sets, reps or duration, rest period per exercise, and for Training Blocks a list of multiple exercises. This data needs to be persisted per scheduled activity.

Two approaches were considered:
- **Join table** (`activity_exercises`): one row per exercise per scheduled activity, normalised columns for sets/reps/rest.
- **JSON blob**: a `details jsonb` column on the `activities` table, storing the full exercise structure as structured JSON.

## Decision
Use a `details jsonb` column on the `activities` table.

## Reasons
- Exercise details are always read and written as a unit with their parent activity — there is no query that filters or aggregates across individual exercise rows.
- The schema is still evolving; a blob is cheaper to change than a normalised table with foreign keys.
- Keeps the data layer simple: one table, one insert, no joins.

## Trade-offs
- Exercise data is not independently queryable (e.g. "all activities with more than 3 sets"). Accepted as a non-requirement at this stage.
- Validation must happen in application code, not DB constraints.
