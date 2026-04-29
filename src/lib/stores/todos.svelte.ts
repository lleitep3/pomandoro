import type { Task } from '../types'

const STORAGE_KEY = 'pomandoro-tasks'

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

function save(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function createTodosStore() {
  let tasks = $state<Task[]>(loadFromStorage())
  let activeTaskId = $state<string | null>(null)

  return {
    get tasks() { return tasks },
    get activeTaskId() { return activeTaskId },
    get activeTask() { return tasks.find(t => t.id === activeTaskId) ?? null },

    addTask(title: string) {
      const trimmed = title.trim()
      if (!trimmed) return
      tasks = [...tasks, { id: crypto.randomUUID(), title: trimmed, pomodoros: 0, done: false }]
      save(tasks)
    },

    removeTask(id: string) {
      tasks = tasks.filter(t => t.id !== id)
      if (activeTaskId === id) activeTaskId = null
      save(tasks)
    },

    toggleDone(id: string) {
      tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
      save(tasks)
    },

    incrementPomodoro(id: string) {
      tasks = tasks.map(t => t.id === id ? { ...t, pomodoros: t.pomodoros + 1 } : t)
      save(tasks)
    },

    selectTask(id: string | null) {
      activeTaskId = id
    },
  }
}

export const todos = createTodosStore()
