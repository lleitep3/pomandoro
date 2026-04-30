import type { Task, TimerMode } from '../types'

const STORAGE_KEY = 'pomandoro-tasks'
const ACTIVE_TASK_KEY = 'pomandoro-active-task-id'

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

function loadActiveTaskId(): string | null {
  return localStorage.getItem(ACTIVE_TASK_KEY)
}

function save(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function saveActiveTaskId(id: string | null) {
  if (id) {
    localStorage.setItem(ACTIVE_TASK_KEY, id)
  } else {
    localStorage.removeItem(ACTIVE_TASK_KEY)
  }
}

function createTodosStore() {
  let tasks = $state<Task[]>(loadFromStorage())
  let activeTaskId = $state<string | null>(loadActiveTaskId())

  return {
    get tasks() { return tasks },
    get activeTaskId() { return activeTaskId },
    get activeTask() { return tasks.find(t => t.id === activeTaskId) ?? null },

    addTask(title: string, priority: 'low' | 'medium' | 'high' = 'medium') {
      const trimmed = title.trim()
      if (!trimmed) return
      tasks = [...tasks, { id: crypto.randomUUID(), title: trimmed, pomodoros: 0, done: false, priority }]
      save(tasks)
    },

    removeTask(id: string) {
      tasks = tasks.filter(t => t.id !== id)
      if (activeTaskId === id) {
        activeTaskId = null
        saveActiveTaskId(null)
      }
      save(tasks)
    },

    toggleDone(id: string) {
      tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
      save(tasks)
    },

    editTask(id: string, newTitle: string) {
      const trimmed = newTitle.trim()
      if (!trimmed) return
      tasks = tasks.map(t => t.id === id ? { ...t, title: trimmed } : t)
      save(tasks)
    },

    setPriority(id: string, priority: 'low' | 'medium' | 'high') {
      tasks = tasks.map(t => t.id === id ? { ...t, priority } : t)
      save(tasks)
    },

    reorderTasks(oldIndex: number, newIndex: number) {
      if (oldIndex < 0 || oldIndex >= tasks.length || newIndex < 0 || newIndex >= tasks.length) return
      const newTasks = [...tasks]
      const [moved] = newTasks.splice(oldIndex, 1)
      newTasks.splice(newIndex, 0, moved)
      tasks = newTasks
      save(tasks)
    },

    incrementPomodoro(id: string) {
      tasks = tasks.map(t => t.id === id ? { ...t, pomodoros: t.pomodoros + 1 } : t)
      save(tasks)
    },

    selectTask(id: string | null) {
      activeTaskId = id
      saveActiveTaskId(id)
    },

    updateTimerState(id: string, mode: TimerMode, remaining: number) {
      tasks = tasks.map(t => t.id === id ? { ...t, timerMode: mode, timerRemaining: remaining } : t)
      save(tasks)
    },

    updateAllTasksProportionally(oldTotal: number, newTotal: number, mode: TimerMode) {
      if (oldTotal <= 0) return
      tasks = tasks.map(t => {
        if (t.timerMode === mode && t.timerRemaining !== undefined) {
          const ratio = t.timerRemaining / oldTotal
          return { ...t, timerRemaining: Math.round(ratio * newTotal) }
        }
        return t
      })
      save(tasks)
    },

    clear() {
      tasks = []
      activeTaskId = null
      save(tasks)
      saveActiveTaskId(null)
    },

    load() {
      tasks = loadFromStorage()
      activeTaskId = loadActiveTaskId()
    }
  }
}

export const todos = createTodosStore()
