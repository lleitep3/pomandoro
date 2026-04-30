import { render } from '@testing-library/svelte'
import { describe, it, expect } from 'vitest'
import PomodoroTimer from './PomodoroTimer.svelte'
import TodoList from './TodoList.svelte'
import SettingsModal from './SettingsModal.svelte'
import HistoryList from './HistoryList.svelte'

describe('Component Smoke Tests', () => {
  it('renders PomodoroTimer', () => {
    const { container } = render(PomodoroTimer)
    expect(container).toBeTruthy()
  })

  it('renders TodoList', () => {
    const { container } = render(TodoList)
    expect(container).toBeTruthy()
  })

  it('renders SettingsModal', () => {
    const { container } = render(SettingsModal, { props: { show: true, onclose: () => {} } })
    expect(container).toBeTruthy()
  })

  it('renders HistoryList', () => {
    const { container } = render(HistoryList)
    expect(container).toBeTruthy()
  })
})
