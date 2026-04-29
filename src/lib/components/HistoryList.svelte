<script lang="ts">
  import { history } from '../stores/history.svelte'

  function formatTime(ms: number) {
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function formatDate(ms: number) {
    return new Date(ms).toLocaleDateString()
  }

  function getModeLabel(mode: string) {
    if (mode === 'work') return 'Foco'
    if (mode === 'short-break') return 'Pausa Curta'
    return 'Pausa Longa'
  }
</script>

<div class="history-panel">
  <div class="history-header">
    <h2 class="history-heading">Histórico</h2>
    {#if history.entries.length > 0}
      <button class="btn-clear" onclick={() => history.clearHistory()}>Limpar</button>
    {/if}
  </div>

  {#if history.entries.length === 0}
    <p class="empty">Nenhuma sessão registrada ainda.</p>
  {:else}
    <ul class="history-list">
      {#each history.entries as entry (entry.id)}
        <li class="history-item">
          <div class="history-main">
            <span class="mode-badge" class:work={entry.mode === 'work'}>
              {getModeLabel(entry.mode)}
            </span>
            <span class="task-title">
              {entry.taskTitle || 'Sem tarefa selecionada'}
            </span>
          </div>
          <div class="history-meta">
            <span>{Math.round(entry.duration / 60)} min</span>
            <span class="dot">•</span>
            <span>{formatDate(entry.completedAt)} {formatTime(entry.completedAt)}</span>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .history-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    min-width: 320px;
    background: var(--surface);
    border-radius: 8px;
    margin: 2rem;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .history-heading {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
  }

  .btn-clear {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 0.8rem;
    cursor: pointer;
  }

  .btn-clear:hover {
    color: var(--accent);
  }

  .empty {
    color: var(--text-muted);
    font-size: 0.875rem;
    text-align: center;
    margin: 2rem 0;
  }

  .history-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .history-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0.75rem;
    background: var(--bg);
    border-radius: 6px;
    border-left: 3px solid var(--border);
  }

  .history-main {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mode-badge {
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--surface-hover);
    color: var(--text-muted);
    font-weight: 600;
  }

  .mode-badge.work {
    background: var(--accent);
    color: #fff;
  }

  .task-title {
    font-size: 0.9rem;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .history-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .dot {
    font-size: 0.5rem;
  }
</style>
