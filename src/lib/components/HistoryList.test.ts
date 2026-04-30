import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HistoryList from './HistoryList.svelte'
import { history } from '../stores/history.svelte'
import { settings } from '../stores/settings.svelte'

describe('HistoryList Component', () => {
  beforeEach(() => {
    history.clearHistory();
    settings.language = 'pt-BR';
    vi.clearAllMocks();
  });

  it('renders empty history', () => {
    render(HistoryList);
    expect(screen.getByText('Nenhum registro ainda.')).toBeTruthy();
  });

  it('renders history entries with different modes and null tasks', () => {
    // Work mode with task
    history.addEntry({ taskId: '1', taskTitle: 'Work Task', mode: 'work', duration: 1500 });
    // Short break without task
    history.addEntry({ taskId: null as any, taskTitle: null as any, mode: 'short-break', duration: 300, type: 'finish' });
    // Long break
    history.addEntry({ taskId: null as any, taskTitle: null as any, mode: 'long-break', duration: 900, type: 'finish' });
    
    render(HistoryList);
    
    expect(screen.getByText('Work Task')).toBeTruthy();
    expect(screen.getByText('Pausa Curta')).toBeTruthy();
    expect(screen.getByText('Pausa Longa')).toBeTruthy();
  });

  it('renders session start badge for play entries', () => {
    history.addEntry({ taskId: '1', taskTitle: 'Task 1', mode: 'work', type: 'play' });
    const { container } = render(HistoryList);
    
    // Check for the badge with 'play' class
    const playBadge = container.querySelector('.mode-badge.play');
    expect(playBadge).toBeTruthy();
  });

  it('clears history', async () => {
    history.addEntry({ taskId: '1', taskTitle: 'Finished Task', mode: 'work', duration: 1500 });
    render(HistoryList);
    
    const clearBtn = screen.getByText('Limpar Histórico');
    await fireEvent.click(clearBtn);
    expect(history.entries).toHaveLength(0);
  });
});
