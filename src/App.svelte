<script lang="ts">
  import PomodoroTimer from './lib/components/PomodoroTimer.svelte'
  import TodoList from './lib/components/TodoList.svelte'
  import HistoryList from './lib/components/HistoryList.svelte'
  import SettingsModal from './lib/components/SettingsModal.svelte'
  import { pomodoro } from './lib/stores/pomodoro.svelte'
  import { todos } from './lib/stores/todos.svelte'
  import { settings } from './lib/stores/settings.svelte'
  import logo from './assets/icon.svg'

  let scrollY = $state(0)
  let zenMode = $state(false)
  let showHistory = $state(false)
  let showSettings = $state(false)
  let showTimer = $state(true)

  const t = settings.t

  $effect(() => {
    const isDark = settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('light-theme', !isDark)
  })

  let lastPomodoroMode = $state(pomodoro.mode)
  let lastPomodoroTotal = $state(pomodoro.total)

  $effect(() => {
    const currentMode = pomodoro.mode
    const currentTotal = pomodoro.total
    
    if (currentMode === lastPomodoroMode && currentTotal !== lastPomodoroTotal) {
      pomodoro.updateProportionally(lastPomodoroTotal, currentTotal)
      todos.updateAllTasksProportionally(lastPomodoroTotal, currentTotal, currentMode)
    }
    
    lastPomodoroMode = currentMode
    lastPomodoroTotal = currentTotal
  })

  let previousActiveElement: HTMLElement | null = null

  function handleGlobalKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      showHistory = false
      showSettings = false
    }

    // Focus trap logic
    if (showHistory || showSettings) {
      if (e.key === 'Tab') {
        const modal = document.querySelector('.modal-content')
        if (!modal) return
        
        const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const first = focusables[0] as HTMLElement
        const last = focusables[focusables.length - 1] as HTMLElement

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
  }

  $effect(() => {
    if (showHistory || showSettings) {
      previousActiveElement = document.activeElement as HTMLElement
      setTimeout(() => {
        const closeBtn = document.querySelector('.btn-close-modal') as HTMLElement
        closeBtn?.focus()
      }, 10)
    } else if (previousActiveElement) {
      previousActiveElement.focus()
      previousActiveElement = null
    }
  })
</script>

<svelte:window bind:scrollY onkeydown={handleGlobalKeydown} />

{#if !zenMode}
  <header class="navbar">
    <div class="logo">
      <img src={logo} alt="PoMandoro" />
      <span class="logo-text">PoMandoro</span>
    </div>

    <div class="nav-center">
      {#if !showTimer || todos.activeTask}
        <button 
          class="mini-timer-btn" 
          onclick={() => showTimer = !showTimer} 
          title={showTimer ? t('minimize') : t('expand')}
          aria-label={showTimer ? t('minimize') : t('expand')}
        >
          <div class="mini-timer">
            <span class="time">{pomodoro.label}</span>
            <span class="mode">{t(pomodoro.mode === 'work' ? 'work' : pomodoro.mode === 'short-break' ? 'shortBreak' : 'longBreak')}</span>
          </div>
        </button>
      {/if}
    </div>

    <div class="nav-actions">
      <button class="nav-btn" onclick={() => showHistory = true} title={t('history')}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8v4l3 3"></path>
          <circle cx="12" cy="12" r="9"></circle>
        </svg>
        <span>{t('history')}</span>
      </button>
      <button class="nav-btn" onclick={() => zenMode = true} title={t('zenMode')}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span>{t('zenMode')}</span>
      </button>
      <button class="nav-btn" onclick={() => showTimer = !showTimer} title={showTimer ? t('compactView') : t('fullView')} aria-label={showTimer ? t('compactView') : t('fullView')}>
        {#if showTimer}
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 1l22 22"/>
            <path d="M17.94 17.94A10 10 0 0 1 12 22c-5.52 0-10-4.48-10-10 0-2.16.78-4.13 2.07-5.66"/>
            <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12"/>
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/>
          </svg>
        {/if}
        <span>{showTimer ? t('compactView') : t('fullView')}</span>
      </button>
      <button class="nav-btn" onclick={() => showSettings = true} aria-label={t('settings')} title={t('settings')}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span>{t('settings')}</span>
      </button>
    </div>
  </header>

  <main class="layout" class:compact={!showTimer}>
    {#if showTimer}
      <section class="timer-section">
        <PomodoroTimer />
      </section>
      <div class="divider"></div>
    {/if}
    <section class="todo-section">
      <TodoList />
    </section>
  </main>

  <footer class="app-footer">
    <p>© {new Date().getFullYear()} PoMandoro.</p>
    <a href="https://github.com/lleitep3/pomandoro" target="_blank" rel="noopener noreferrer">
      <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
      GitHub
    </a>
  </footer>
{:else}
  <main class="zen-layout">
    <button class="btn-exit-zen" onclick={() => zenMode = false}>{t('exitZen')}</button>
    <PomodoroTimer />
  </main>
{/if}

{#if showHistory}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={() => showHistory = false}>
    <div 
      class="modal-content" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="history-title"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
    >
      <button class="btn-close-modal" onclick={() => showHistory = false} aria-label={t('close')}>✕</button>
      <HistoryList />
    </div>
  </div>
{/if}

{#if showSettings}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={() => showSettings = false}>
    <div 
      class="modal-content" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="settings-title"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
    >
      <button class="btn-close-modal" onclick={() => showSettings = false} aria-label={t('close')}>✕</button>
      <SettingsModal />
    </div>
  </div>
{/if}

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(:root) {
    --bg: #1a1a2e;
    --surface: #16213e;
    --surface-hover: #0f3460;
    --accent: #e94560;
    --track: #2a2a4a;
    --border: #2a2a4a;
    --text: #eaeaea;
    --text-muted: #888;
  }

  :global(.light-theme) {
    --bg: #f5f7fa;
    --surface: #ffffff;
    --surface-hover: #edf2f7;
    --accent: #e94560;
    --track: #e2e8f0;
    --border: #e2e8f0;
    --text: #2d3748;
    --text-muted: #718096;
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    min-height: 100vh;
  }

  .navbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 1.5rem;
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    min-height: 57px;
    transition: min-height 0.2s;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent);
    height: 28px;
  }

  .logo img {
    height: 28px;
    width: 28px;
  }

  .layout {
    display: flex;
    flex-wrap: wrap;
    min-height: calc(100vh - 57px - 69px);
  }

  .timer-section {
    flex: 1;
    padding-top: 2rem;
  }

  .divider {
    width: 1px;
    background: var(--border);
    align-self: stretch;
  }

  .todo-section {
    flex: 1;
    min-width: 320px;
    padding-top: 2rem;
  }

  @media (max-width: 640px) {
    .divider {
      width: 100%;
      height: 1px;
      align-self: auto;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .mini-timer {
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    min-width: 140px;
    height: 28px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .mini-timer-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .mini-timer-btn:hover {
    transform: scale(1.05);
  }

  .mini-timer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(233, 69, 96, 0.1);
    padding: 6px 16px;
    border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9rem;
    border: 1px solid rgba(233, 69, 96, 0.3);
    white-space: nowrap;
    transition: all 0.2s;
  }

  .mini-timer:hover {
    background: rgba(233, 69, 96, 0.15);
    border-color: #e94560;
  }

  .mini-timer .time {
    color: var(--text);
    font-weight: 800;
  }

  .mini-timer .mode {
    color: #e94560;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .nav-actions {
    display: flex;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  .nav-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-btn:hover {
    background: var(--surface-hover);
    color: var(--text);
  }


  @media (max-width: 640px) {
    .logo-text {
      display: none;
    }
    .nav-btn span {
      display: none;
    }
    .nav-actions {
      gap: 0.15rem;
    }
    .nav-btn {
      padding: 0.4rem 0.3rem;
    }
  }

  @media (max-width: 400px) {
    .mini-timer .mode {
      display: none;
    }
    .mini-timer {
      padding: 2px 6px;
    }
  }

  .zen-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    padding: 2rem;
  }

  .btn-exit-zen {
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-exit-zen:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }

  .modal-content {
    background: var(--bg);
    border-radius: 12px;
    position: relative;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .btn-close-modal {
    position: absolute;
    top: 15px;
    right: 15px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 1.2rem;
    cursor: pointer;
  }

  .btn-close-modal:hover {
    color: var(--accent);
  }

  .app-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: var(--surface);
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 0.9rem;
    min-height: 69px;
  }

  .app-footer p {
    margin: 0;
  }

  .app-footer a {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
  }

  .app-footer a:hover {
    color: var(--accent);
  }
</style>
