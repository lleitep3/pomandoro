<script lang="ts">
  import { pomodoro } from '../stores/pomodoro.svelte'
  import { todos } from '../stores/todos.svelte'
  import type { TimerMode } from '../types'

  const SIZE = 240
  const STROKE = 12
  const RADIUS = (SIZE - STROKE) / 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const modes: { key: TimerMode; label: string }[] = [
    { key: 'work', label: 'Foco' },
    { key: 'short-break', label: 'Pausa' },
    { key: 'long-break', label: 'Descanso' },
  ]

  const dashoffset = $derived(CIRCUMFERENCE * (1 - pomodoro.progress))
</script>

<div class="timer-panel">
  <div class="mode-tabs">
    {#each modes as m}
      <button
        class="mode-tab"
        class:active={pomodoro.mode === m.key}
        onclick={() => pomodoro.setMode(m.key)}
      >
        {m.label}
      </button>
    {/each}
  </div>

  <div class="clock-wrap">
    <svg width={SIZE} height={SIZE} viewBox="0 0 {SIZE} {SIZE}">
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--track)"
        stroke-width={STROKE}
      />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="var(--accent)"
        stroke-width={STROKE}
        stroke-linecap="round"
        stroke-dasharray={CIRCUMFERENCE}
        stroke-dashoffset={dashoffset}
        transform="rotate(-90 {SIZE / 2} {SIZE / 2})"
        style="transition: stroke-dashoffset 0.5s linear"
      />
    </svg>
    <div class="clock-label">
      <span class="time">{pomodoro.label}</span>
      {#if todos.activeTask}
        <span class="active-task">{todos.activeTask.title}</span>
      {/if}
    </div>
  </div>

  <div class="controls">
    {#if pomodoro.running}
      <button class="btn btn-secondary" onclick={() => pomodoro.pause()}>Pausar</button>
    {:else}
      <button class="btn btn-primary" onclick={() => pomodoro.start()}>Iniciar</button>
    {/if}
    <button class="btn btn-ghost" onclick={() => pomodoro.reset()}>Reiniciar</button>
  </div>

  <p class="pomodoro-count">
    🍅 {pomodoro.workCount} {pomodoro.workCount === 1 ? 'pomodoro' : 'pomodoros'} hoje
  </p>
</div>

<style>
  .timer-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
  }

  .mode-tabs {
    display: flex;
    gap: 0.5rem;
    background: var(--surface);
    border-radius: 8px;
    padding: 4px;
  }

  .mode-tab {
    padding: 0.4rem 1rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-muted);
    transition: all 0.2s;
  }

  .mode-tab.active {
    background: var(--accent);
    color: #fff;
    font-weight: 600;
  }

  .clock-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clock-label {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .time {
    font-size: 3rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--text);
  }

  .active-task {
    font-size: 0.75rem;
    color: var(--text-muted);
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .controls {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.6rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }

  .btn:active {
    transform: scale(0.97);
  }

  .btn-primary {
    background: var(--accent);
    color: #fff;
  }

  .btn-secondary {
    background: var(--surface);
    color: var(--text);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-muted);
  }

  .btn:hover {
    opacity: 0.85;
  }

  .pomodoro-count {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 0;
  }
</style>
