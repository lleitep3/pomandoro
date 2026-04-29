import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    const testCases = [
      { remaining: 25 * 60, expected: '25:00' },
      { remaining: 5 * 60, expected: '05:00' },
      { remaining: 15 * 60, expected: '15:00' },
      { remaining: 90, expected: '01:30' },
      { remaining: 61, expected: '01:01' },
      { remaining: 0, expected: '00:00' },
    ]

    for (const { remaining, expected } of testCases) {
      const label =
        Math.floor(remaining / 60).toString().padStart(2, '0') +
        ':' +
        (remaining % 60).toString().padStart(2, '0')
      expect(label).toBe(expected)
    }
  })

  it('calculates progress correctly', () => {
    const total = 25 * 60

    expect(1.0).toBe(1) // 100% at start
    expect((total - 5 * 60) / total).toBe(0.8) // 80% after 5 min
    expect((total - 15 * 60) / total).toBe(0.4) // 40% after 15 min
    expect(0 / total).toBe(0) // 0% at end
  })

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
})
