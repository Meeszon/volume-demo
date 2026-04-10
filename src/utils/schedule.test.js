import { describe, it, expect } from 'vitest';
import { parseSubtitle, getTotalReps } from './schedule.js';

describe('parseSubtitle', () => {
  it('parses a standard reps x sets string', () => {
    expect(parseSubtitle('4 Reps x 4 Sets')).toEqual({ reps: 4, sets: 4 });
  });

  it('parses different numbers', () => {
    expect(parseSubtitle('10 Reps x 3 Sets')).toEqual({ reps: 10, sets: 3 });
  });

  it('returns null for a plain text subtitle', () => {
    expect(parseSubtitle('Cossack Squat, Leg Swings, Press Ups..')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseSubtitle('')).toBeNull();
  });
});

describe('getTotalReps', () => {
  it('multiplies reps by sets', () => {
    expect(getTotalReps('4 Reps x 4 Sets')).toBe(16);
  });

  it('works for other values', () => {
    expect(getTotalReps('10 Reps x 3 Sets')).toBe(30);
  });

  it('returns 0 when the unit is not reps (e.g. problems)', () => {
    expect(getTotalReps('5 Problems x 3 Sets')).toBe(0);
  });

  it('returns 0 for plain text', () => {
    expect(getTotalReps('General Warm Up')).toBe(0);
  });
});
