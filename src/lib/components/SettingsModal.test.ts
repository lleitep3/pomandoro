import { render, screen, fireEvent } from '@testing-library/svelte'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SettingsModal from './SettingsModal.svelte'
import { settings } from '../stores/settings.svelte'

describe('SettingsModal Component', () => {
  beforeEach(() => {
    settings.reset();
    settings.language = 'pt-BR';
    vi.clearAllMocks();
  });

  it('renders correctly when shown', () => {
    render(SettingsModal, { props: { show: true, onclose: () => {} } });
    expect(screen.getByText('Configurações')).toBeTruthy();
  });

  it('updates durations', async () => {
    render(SettingsModal, { props: { show: true, onclose: () => {} } });
    const workInput = screen.getByLabelText('Foco');
    await fireEvent.input(workInput, { target: { value: '30' } });
    expect(settings.durations.work).toBe(30);
  });

  it('updates break durations', async () => {
    render(SettingsModal, { props: { show: true, onclose: () => {} } });
    
    const shortInput = screen.getByLabelText('Pausa Curta');
    await fireEvent.input(shortInput, { target: { value: '10' } });
    expect(settings.durations['short-break']).toBe(10);
    
    const longInput = screen.getByLabelText('Pausa Longa');
    await fireEvent.input(longInput, { target: { value: '20' } });
    expect(settings.durations['long-break']).toBe(20);
  });

  it('changes language', async () => {
    render(SettingsModal, { props: { show: true, onclose: () => {} } });
    const langSelect = screen.getByLabelText('Idioma');
    await fireEvent.input(langSelect, { target: { value: 'en' } });
    expect(settings.language).toBe('en');
  });

  it('resets settings', async () => {
    settings.updateDuration('work', 45);
    render(SettingsModal, { props: { show: true, onclose: () => {} } });
    const resetBtn = screen.getByText('Resetar para padrões');
    await fireEvent.click(resetBtn);
    expect(settings.durations.work).toBe(25);
  });

  it('clears data after confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const clearSpy = vi.spyOn(Storage.prototype, 'clear');
    
    // Mock location.reload
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };

    render(SettingsModal, { props: { show: true, onclose: () => {} } });
    
    const clearBtn = screen.getByText('Limpar Dados');
    await fireEvent.click(clearBtn);
    
    expect(confirmSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
    
    // Restore location
    window.location = originalLocation;
  });
});
