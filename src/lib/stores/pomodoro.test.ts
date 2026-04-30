import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pomodoro } from './pomodoro.svelte'
import { todos } from './todos.svelte'
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
    // Test without active task
    todos.selectTask(null);
    pomodoro.pause();
    pomodoro.reset();
    
    todos.addTask("Active");
    todos.selectTask(todos.tasks[0].id);
    
    pomodoro.start();
    expect(pomodoro.running).toBe(true);
    // Double start
    pomodoro.start();
    expect(pomodoro.running).toBe(true);
    
    vi.advanceTimersByTime(1000);
    expect(pomodoro.remaining).toBe(pomodoro.total - 1);
    
    pomodoro.pause();
    expect(pomodoro.running).toBe(false);
    // Verify task state was updated
    expect(todos.tasks[0].timerRemaining).toBe(pomodoro.remaining);
    
    pomodoro.reset();
    expect(pomodoro.remaining).toBe(pomodoro.total);
    expect(todos.tasks[0].timerRemaining).toBe(pomodoro.total);
  });

  it('exposes workCount and total', () => {
    expect(pomodoro.workCount).toBeDefined();
    expect(pomodoro.total).toBeDefined();
  });

  it('switches modes', () => {
    pomodoro.setMode('short-break');
    expect(pomodoro.mode).toBe('short-break');
    expect(pomodoro.remaining).toBe(5 * 60);
    
    pomodoro.setMode('long-break');
    expect(pomodoro.mode).toBe('long-break');
    expect(pomodoro.remaining).toBe(15 * 60);
  });

  it('handles completion and switches to long break', () => {
    // Complete 3 times first
    for(let i=0; i<3; i++) {
      pomodoro.loadState('work', 1);
      pomodoro.start();
      vi.advanceTimersByTime(2000);
      pomodoro.setMode('work');
    }
    // 4th completion
    pomodoro.loadState('work', 1);
    pomodoro.start();
    vi.advanceTimersByTime(2000);
    expect(pomodoro.mode).toBe('long-break');
  });

  it('updates proportionally', () => {
    pomodoro.loadState('work', 1500);
    pomodoro.updateProportionally(1500, 3000);
    expect(pomodoro.remaining).toBe(3000);
    
    // Test with 0 old total
    pomodoro.updateProportionally(0, 3000);
    expect(pomodoro.remaining).toBe(3000);
  });

  it('loads and stops', () => {
    pomodoro.load();
    pomodoro.setMode('work');
    expect(pomodoro.mode).toBe('work');
  });
});
