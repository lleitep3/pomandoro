import type { TimerMode } from '../types'
import { todos } from './todos.svelte'
import { history } from './history.svelte'

import { settings } from './settings.svelte'

function beep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  } catch {
    // AudioContext not available
  }
}

function createPomodoroStore() {
  let mode = $state<TimerMode>('work')
  let remaining = $state(settings.durations['work'] * 60)
  let running = $state(false)
  let workCount = $state(0)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const total = $derived(settings.durations[mode] * 60)
  const progress = $derived(remaining / total)
  let lastTotal = settings.durations[mode] * 60

  $effect(() => {
    const newTotal = settings.durations[mode] * 60
    if (newTotal !== lastTotal) {
      const ratio = remaining / lastTotal
      remaining = Math.max(0, Math.round(ratio * newTotal))
      lastTotal = newTotal
    }
  })
  const label = $derived(
    Math.floor(remaining / 60).toString().padStart(2, '0') +
    ':' +
    (remaining % 60).toString().padStart(2, '0')
  )

  function tick() {
    if (remaining <= 0) {
      stop()
      beep()
      onComplete()
      return
    }
    remaining--
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    running = false
  }

  function onComplete() {
    history.addEntry({
      taskId: todos.activeTaskId,
      taskTitle: todos.activeTask?.title ?? null,
      mode,
      duration: settings.durations[mode] * 60
    })

    if (mode === 'work') {
      workCount++
      if (todos.activeTaskId) {
        todos.incrementPomodoro(todos.activeTaskId)
      }
      setMode(workCount % 4 === 0 ? 'long-break' : 'short-break')
    } else {
      setMode('work')
    }
  }

  function setMode(m: TimerMode) {
    stop()
    mode = m
    remaining = settings.durations[m] * 60
    if (todos.activeTaskId) {
      todos.updateTimerState(todos.activeTaskId, mode, remaining)
    }
  }

  return {
    get mode() { return mode },
    get remaining() { return remaining },
    get running() { return running },
    get workCount() { return workCount },
    get total() { return total },
    get progress() { return progress },
    get label() { return label },

    start() {
      if (running) return
      running = true
      intervalId = setInterval(tick, 1000)
    },

    pause() {
      stop()
      if (todos.activeTaskId) {
        todos.updateTimerState(todos.activeTaskId, mode, remaining)
      }
    },

    loadState(m: TimerMode, rem: number) {
      stop()
      mode = m
      remaining = rem
    },

    reset() {
      stop()
      remaining = settings.durations[mode] * 60
      if (todos.activeTaskId) {
        todos.updateTimerState(todos.activeTaskId, mode, remaining)
      }
    },

    setMode,
  }
}

export const pomodoro = createPomodoroStore()
