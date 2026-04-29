export type TimerMode = 'work' | 'short-break' | 'long-break'

export interface Task {
  id: string
  title: string
  pomodoros: number
  done: boolean
}
