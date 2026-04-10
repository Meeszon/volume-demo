// Parses a subtitle like "10 Reps x 3 Sets" into { reps: 10, sets: 3 }.
// Returns null if the subtitle doesn't match that format.
export function parseSubtitle(subtitle) {
  const match = subtitle.match(/(\d+)\s+Reps?\s+x\s+(\d+)\s+Sets?/i);
  if (!match) return null;
  return { reps: parseInt(match[1], 10), sets: parseInt(match[2], 10) };
}

// Returns total reps (reps * sets) for a subtitle string.
// Returns 0 if the subtitle isn't in the expected format.
export function getTotalReps(subtitle) {
  const parsed = parseSubtitle(subtitle);
  if (!parsed) return 0;
  return parsed.reps * parsed.sets;
}
