<script lang="ts">
  import PomodoroTimer from './lib/components/PomodoroTimer.svelte'
  import TodoList from './lib/components/TodoList.svelte'
  import HistoryList from './lib/components/HistoryList.svelte'
  import logo from './assets/icon.svg'
</script>

<header class="navbar">
  <div class="logo">
    <img src={logo} alt="PoMandoro" />
    <span>PoMandoro</span>
  </div>
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
</style>
