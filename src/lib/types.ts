export type TimerMode = 'work' | 'short-break' | 'long-break'

export interface Task {
  id: string
  title: string
  pomodoros: number
  done: boolean
  priority?: 'low' | 'medium' | 'high'
}

export interface HistoryEntry {
  id: string
  taskId: string | null
  taskTitle: string | null
  mode: TimerMode
  duration: number
  completedAt: number
}
