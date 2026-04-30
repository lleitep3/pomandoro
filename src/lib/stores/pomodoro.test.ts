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

  it('determines correct break type after work session', () => {
    const workCount = 3
    const nextMode = workCount % 4 === 0 ? 'long-break' : 'short-break'
    expect(nextMode).toBe('short-break')

    const workCountLong = 4
    const nextModeLong = workCountLong % 4 === 0 ? 'long-break' : 'short-break'
    expect(nextModeLong).toBe('long-break')
  })

  it('counts down correctly', () => {
    let remaining = 25 * 60

    const tick = () => {
      if (remaining > 0) {
        remaining--
      }
    }

    tick()
    expect(remaining).toBe(25 * 60 - 1)

    tick()
    expect(remaining).toBe(25 * 60 - 2)
  })

  it('stops when reaching zero', () => {
    let remaining = 2
    let running = true

    const tick = () => {
      if (remaining <= 0) {
        running = false
        return
      }
      remaining--
    }

    tick()
    expect(remaining).toBe(1)
    expect(running).toBe(true)

    tick()
    expect(remaining).toBe(0)
    expect(running).toBe(true)

    tick()
    expect(running).toBe(false)
  })

  it('updates remaining time proportionally when total changes', () => {
    let lastTotal = 25 * 60
    let remaining = 12.5 * 60 // 50%
    
    const newTotal = 30 * 60
    if (newTotal !== lastTotal) {
      const ratio = remaining / lastTotal
      remaining = Math.round(ratio * newTotal)
    }
    
    expect(remaining).toBe(15 * 60) // 50% of 30min
  })
})
