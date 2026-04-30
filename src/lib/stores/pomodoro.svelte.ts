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

const STORAGE_KEY = 'pomandoro-timer-state'

interface TimerState {
  mode: TimerMode
  remaining: number
  running: boolean
  workCount: number
  lastUpdate: number
}

function createPomodoroStore() {
  let mode = $state<TimerMode>('work')
  let remaining = $state(settings.durations['work'] * 60)
  let running = $state(false)
  let workCount = $state(0)
  let intervalId: ReturnType<typeof setInterval> | null = null

  // Persistence
  function save() {
    const state: TimerState = {
      mode,
      remaining,
      running,
      workCount,
      lastUpdate: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  function load() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const state: TimerState = JSON.parse(saved)
      mode = state.mode
      workCount = state.workCount
      
      const elapsed = state.running ? Math.floor((Date.now() - state.lastUpdate) / 1000) : 0
      remaining = Math.max(0, state.remaining - elapsed)
      
      if (state.running && remaining > 0) {
        start()
      } else if (state.running && remaining <= 0) {
        // Timer finished while away
        remaining = 0
        beep()
        onComplete()
      }
    } catch (e) {
      console.error('Failed to load timer state', e)
    }
  }

  const total = $derived(settings.durations[mode] * 60)
  const progress = $derived(remaining / total)

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
    save() // Persist every tick
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    running = false
    save()
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
    save()
  }

  function setMode(m: TimerMode) {
    stop()
    mode = m
    remaining = settings.durations[m] * 60
    if (todos.activeTaskId) {
      todos.updateTimerState(todos.activeTaskId, mode, remaining)
    }
    save()
  }

  function start() {
    if (running && intervalId) return
    running = true
    save()
    intervalId = setInterval(tick, 1000)
  }

  // Load state on creation
  if (typeof localStorage !== 'undefined') {
    setTimeout(load, 0) // Ensure settings and other stores are ready
  }

  return {
    get mode() { return mode },
    get remaining() { return remaining },
    get running() { return running },
    get workCount() { return workCount },
    get total() { return total },
    get progress() { return progress },
    get label() { return label },

    start,

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
      save()
    },

    reset() {
      stop()
      remaining = settings.durations[mode] * 60
      if (todos.activeTaskId) {
        todos.updateTimerState(todos.activeTaskId, mode, remaining)
      }
      save()
    },

    updateProportionally(oldTotal: number, newTotal: number) {
      if (oldTotal <= 0) return
      const ratio = remaining / oldTotal
      remaining = Math.max(0, Math.round(ratio * newTotal))
      save()
    },

    setMode,

    load() {
      load()
    }
  }
}

export const pomodoro = createPomodoroStore()
