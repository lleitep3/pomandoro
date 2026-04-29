<script lang="ts">
  import PomodoroTimer from './lib/components/PomodoroTimer.svelte'
  import TodoList from './lib/components/TodoList.svelte'
  import HistoryList from './lib/components/HistoryList.svelte'
  import { pomodoro } from './lib/stores/pomodoro.svelte'
  import { todos } from './lib/stores/todos.svelte'
  import logo from './assets/icon.svg'

  let scrollY = $state(0)
  let zenMode = $state(false)
  let showHistory = $state(false)

  const modeLabels = {
    'work': 'Foco',
    'short-break': 'Pausa Curta',
    'long-break': 'Pausa Longa'
  }
</script>

<svelte:window bind:scrollY />

{#if !zenMode}
  <header class="navbar">
    <div class="logo">
      <img src={logo} alt="PoMandoro" />
      <span>PoMandoro</span>
    </div>
    <div class="nav-right">
      {#if scrollY > 150}
        <div class="mini-timer-wrap">
          <div 
            class="mini-timer"
            style="background: linear-gradient(to right, var(--accent) {(1 - pomodoro.progress) * 100}%, var(--surface-hover) {(1 - pomodoro.progress) * 100}%);"
          >
            <div class="mini-timer-content">
              <span class="mini-time">{pomodoro.label}</span>
              <span class="mini-mode">{modeLabels[pomodoro.mode]}</span>
            </div>
          </div>
          {#if todos.activeTask}
            <div class="mini-task" title={todos.activeTask.title}>{todos.activeTask.title}</div>
          {/if}
        </div>
      {:else}
        <div class="nav-actions">
          <button class="nav-btn" onclick={() => showHistory = true}>Histórico</button>
          <button class="nav-btn" onclick={() => zenMode = true}>Zen Mode</button>
        </div>
      {/if}
    </div>
  </header>

  <main class="layout">
    <section class="timer-section">
      <PomodoroTimer />
    </section>
    <div class="divider"></div>
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
    <button class="btn-exit-zen" onclick={() => zenMode = false}>Sair do Modo Zen</button>
    <PomodoroTimer />
  </main>
{/if}

{#if showHistory}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={() => showHistory = false}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <button class="btn-close-modal" onclick={() => showHistory = false}>✕</button>
      <HistoryList />
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
    min-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .mini-timer-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    animation: fadeIn 0.3s ease;
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

  .mini-timer-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    z-index: 1;
  }

  .mini-task {
    font-size: 0.85rem;
    color: var(--text-muted);
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-right {
    display: flex;
    align-items: center;
  }

  .nav-actions {
    display: flex;
    gap: 0.5rem;
    animation: fadeIn 0.3s ease;
  }

  .nav-btn {
    background: var(--surface-hover);
    color: var(--text);
    border: none;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s, color 0.2s;
  }

  .nav-btn:hover {
    background: var(--accent);
    color: #fff;
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
