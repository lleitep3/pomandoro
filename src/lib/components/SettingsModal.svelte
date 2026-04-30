<script lang="ts">
  import { settings } from '../stores/settings.svelte'

  const t = settings.t
</script>

<div class="settings-panel">
  <div class="settings-header">
    <h3 id="settings-title">{t('settings')}</h3>
  </div>

  <div class="settings-content">
    <!-- Language -->
    <div class="setting-group">
      <label for="lang-select">{t('language')}</label>
      <select id="lang-select" value={settings.language} oninput={(e) => settings.language = (e.target as HTMLSelectElement).value as any}>
        <option value="pt-BR">Português (BR)</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>

    <!-- Theme -->
    <div class="setting-group">
      <label for="theme-select">{t('theme')}</label>
      <select id="theme-select" value={settings.theme} oninput={(e) => settings.theme = (e.target as HTMLSelectElement).value as any}>
        <option value="system">{t('system')}</option>
        <option value="dark">{t('dark')}</option>
        <option value="light">{t('light')}</option>
      </select>
    </div>

    <!-- Durations -->
    <fieldset class="setting-group">
      <legend>{t('durations')}</legend>
      <div class="duration-inputs">
        <div class="input-item">
          <label for="work-duration">{t('work')}</label>
          <input 
            id="work-duration"
            type="number" 
            min="1" 
            max="60" 
            value={settings.durations.work} 
            oninput={(e) => settings.updateDuration('work', parseInt((e.target as HTMLInputElement).value) || 25)}
          />
        </div>
        <div class="input-item">
          <label for="short-duration">{t('shortBreak')}</label>
          <input 
            id="short-duration"
            type="number" 
            min="1" 
            max="30" 
            value={settings.durations['short-break']} 
            oninput={(e) => settings.updateDuration('short-break', parseInt((e.target as HTMLInputElement).value) || 5)}
          />
        </div>
        <div class="input-item">
          <label for="long-duration">{t('longBreak')}</label>
          <input 
            id="long-duration"
            type="number" 
            min="1" 
            max="60" 
            value={settings.durations['long-break']} 
            oninput={(e) => settings.updateDuration('long-break', parseInt((e.target as HTMLInputElement).value) || 15)}
          />
        </div>
      </div>
    </fieldset>

    <div class="settings-footer">
      <button class="btn-reset" onclick={() => {
        settings.reset()
      }}>
        {t('reset')}
      </button>
      <button class="btn-danger" onclick={() => {
        if (confirm(t('confirmClearData') || 'Clear all data?')) {
          localStorage.clear()
          window.location.reload()
        }
      }}>
        {t('clearData')}
      </button>
    </div>
  </div>
</div>

<style>
  .settings-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    min-width: 320px;
    background: var(--surface);
    border-radius: 8px;
  }

  .settings-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text);
  }

  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: none;
    padding: 0;
    margin: 0;
  }

  .setting-group label, .setting-group legend {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  select {
    padding: 0.6rem;
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    outline: none;
    cursor: pointer;
    font-family: inherit;
  }

  .duration-inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .input-item {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: center;
  }

  .input-item label {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-align: center;
  }

  input[type="number"] {
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    text-align: center;
    outline: none;
    font-family: inherit;
  }

  input:focus, select:focus {
    border-color: var(--accent);
  }

  .settings-footer {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }

  .btn-reset {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-reset:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .btn-danger {
    background: none;
    border: 1px solid rgba(233, 69, 96, 0.3);
    color: var(--accent);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-danger:hover {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
</style>
