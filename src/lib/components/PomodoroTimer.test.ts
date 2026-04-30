import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PomodoroTimer from './PomodoroTimer.svelte'
import { pomodoro } from '../stores/pomodoro.svelte'
import { todos } from '../stores/todos.svelte'
import { history } from '../stores/history.svelte'
import { settings } from '../stores/settings.svelte'

describe('PomodoroTimer Component', () => {
  beforeEach(() => {
    pomodoro.reset();
    todos.clear();
    history.clearHistory();
    settings.language = 'pt-BR';
    vi.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(PomodoroTimer);
    expect(screen.getByText('25:00')).toBeTruthy();
    expect(screen.getByText('Iniciar')).toBeTruthy();
  });

  it('changes mode and updates colors', async () => {
    render(PomodoroTimer);
    const shortBtn = screen.getByText('Pausa Curta');
    await fireEvent.click(shortBtn);
    expect(pomodoro.mode).toBe('short-break');
    expect(screen.getByText('05:00')).toBeTruthy();
  });

  it('starts timer and adds history entry', async () => {
    todos.addTask('Test Task');
    todos.selectTask(todos.tasks[0].id);
    
    render(PomodoroTimer);
    const startBtn = screen.getByText('Iniciar');
    await fireEvent.click(startBtn);
    
    expect(pomodoro.running).toBe(true);
    expect(history.entries).toHaveLength(1);
    expect(history.entries[0].type).toBe('play');
  });

  it('pauses and resets', async () => {
    render(PomodoroTimer);
    
    // Start
    const startBtn = screen.getByText('Iniciar');
    await fireEvent.click(startBtn);
    expect(pomodoro.running).toBe(true);
    
    // Pause - The button text should now be 'Pausar'
    const pauseBtn = screen.getByText('Pausar');
    await fireEvent.click(pauseBtn);
    expect(pomodoro.running).toBe(false);
    
    // Reset
    const resetBtn = screen.getByText('Reiniciar');
    await fireEvent.click(resetBtn);
    expect(pomodoro.remaining).toBe(pomodoro.total);
  });

  it('displays active task title', () => {
    todos.addTask('Learning Svelte');
    todos.selectTask(todos.tasks[0].id);
    
    render(PomodoroTimer);
    expect(screen.getByText('Learning Svelte')).toBeTruthy();
  });
});
