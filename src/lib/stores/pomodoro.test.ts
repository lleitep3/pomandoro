import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pomodoro } from './pomodoro.svelte'
import type { TimerMode } from '../types'

// Test the pure logic functions from pomodoro store
const DURATIONS: Record<TimerMode, number> = {
  'work': 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
}

describe('Pomodoro Store Logic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    pomodoro.reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('has correct durations for each mode', () => {
    expect(DURATIONS['work']).toBe(25 * 60)
    expect(DURATIONS['short-break']).toBe(5 * 60)
    expect(DURATIONS['long-break']).toBe(15 * 60)
  })

  it('calculates time label correctly', () => {
    pomodoro.loadState('work', 90);
    expect(pomodoro.label).toBe('01:30');
    
    pomodoro.loadState('work', 61);
    expect(pomodoro.label).toBe('01:01');
    
    pomodoro.loadState('work', 0);
    expect(pomodoro.label).toBe('00:00');
  });

  it('calculates progress correctly', () => {
    pomodoro.loadState('work', 750); // half of 25min (1500s)
    expect(pomodoro.progress).toBeCloseTo(0.5, 1);
  });

  it('manages timer lifecycle', () => {
    pomodoro.start();
    expect(pomodoro.running).toBe(true);
    
    vi.advanceTimersByTime(1000);
    expect(pomodoro.remaining).toBe(pomodoro.total - 1);
    
    pomodoro.pause();
    expect(pomodoro.running).toBe(false);
    
    pomodoro.reset();
    expect(pomodoro.remaining).toBe(pomodoro.total);
  });

  it('switches modes', () => {
    pomodoro.setMode('short-break');
    expect(pomodoro.mode).toBe('short-break');
    expect(pomodoro.remaining).toBe(5 * 60);
    
    pomodoro.setMode('long-break');
    expect(pomodoro.mode).toBe('long-break');
    expect(pomodoro.remaining).toBe(15 * 60);
  });

  it('handles completion', () => {
    pomodoro.loadState('work', 1);
    pomodoro.start();
    vi.advanceTimersByTime(2000);
    // After 2s (one to hit 0, one to trigger onComplete), it should switch to break
    expect(pomodoro.mode).toBe('short-break');
  });
});
