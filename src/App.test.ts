import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App.svelte'
import { settings } from './lib/stores/settings.svelte'
import { todos } from './lib/stores/todos.svelte'
import { pomodoro } from './lib/stores/pomodoro.svelte'

describe('App Component', () => {
  beforeEach(() => {
    settings.language = 'pt-BR';
    todos.clear();
    pomodoro.reset();
  });

  it('toggles zen mode', async () => {
    render(App);
    const zenBtn = screen.getByText('Modo Zen');
    await fireEvent.click(zenBtn);
    // Header should be hidden in zen mode
    expect(screen.queryByText('PoMandoro')).toBeNull();
  });

  it('opens modals', async () => {
    render(App);
    const historyBtn = screen.getByText('Histórico');
    await fireEvent.click(historyBtn);
    expect(screen.getByText('Histórico de Atividades')).toBeTruthy();
    
    const closeBtn = screen.getByLabelText('Fechar');
    await fireEvent.click(closeBtn);
  });
});
