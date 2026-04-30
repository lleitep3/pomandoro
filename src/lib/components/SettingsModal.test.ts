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
    const workInput = screen.getAllByRole('spinbutton')[0]; // First input is work duration
    await fireEvent.input(workInput, { target: { value: '30' } });
    expect(settings.durations.work).toBe(30);
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
});
