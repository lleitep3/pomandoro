<script lang="ts">
  import PomodoroTimer from './lib/components/PomodoroTimer.svelte'
  import TodoList from './lib/components/TodoList.svelte'
  import HistoryList from './lib/components/HistoryList.svelte'
  import { pomodoro } from './lib/stores/pomodoro.svelte'
  import { todos } from './lib/stores/todos.svelte'
  import logo from './assets/icon.svg'

  let scrollY = $state(0)

  const modeLabels = {
    'work': 'Foco',
    'short-break': 'Pausa Curta',
    'long-break': 'Pausa Longa'
  }
</script>

<svelte:window bind:scrollY />

<header class="navbar">
  <div class="logo">
    <img src={logo} alt="PoMandoro" />
    <span>PoMandoro</span>
  </div>
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
        <div class="mini-task">{todos.activeTask.title}</div>
      {/if}
    </div>
  {/if}
</header>

<main class="layout">
  <section class="timer-section">
    <PomodoroTimer />
    <HistoryList />
  </section>
  <div class="divider"></div>
  <section class="todo-section">
    <TodoList />
  </section>
</main>

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
    align-items: center;
    justify-content: space-between;
    min-height: 57px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent);
  }

  .logo img {
    height: 28px;
    width: 28px;
  }

  .layout {
    display: flex;
    flex-wrap: wrap;
    min-height: calc(100vh - 57px);
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
    font-size: 0.7rem;
    color: var(--text-muted);
    max-width: 140px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
