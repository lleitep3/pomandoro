<script lang="ts">
  import { todos } from '../stores/todos.svelte'
  import { pomodoro } from '../stores/pomodoro.svelte'
  import type { Task } from '../types'

  let newTitle = $state('')
  let editingId = $state<string | null>(null)
  let editTitle = $state('')

  function startEdit(task: Task) {
    editingId = task.id
    editTitle = task.title
  }

  function saveEdit() {
    if (editingId) {
      todos.editTask(editingId, editTitle)
      editingId = null
    }
  }

  function handleEditKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') editingId = null
  }

  let newPriority = $state<'low' | 'medium' | 'high'>('medium')
  
  function cycleNewPriority() {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
    const currentIdx = priorities.indexOf(newPriority)
    newPriority = priorities[(currentIdx + 1) % priorities.length]
  }

  let draggedIndex = $state<number | null>(null)

  function handleDragStart(e: DragEvent, index: number) {
    draggedIndex = index
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', index.toString())
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
  }

  function handleDrop(e: DragEvent, dropIndex: number) {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      todos.reorderTasks(draggedIndex, dropIndex)
    }
    draggedIndex = null
  }

  function cyclePriority(task: Task) {
    const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
    const currentIdx = priorities.indexOf(task.priority || 'medium')
    const nextIdx = (currentIdx + 1) % priorities.length
    todos.setPriority(task.id, priorities[nextIdx])
  }

  function handleAdd() {
    todos.addTask(newTitle, newPriority)
    newTitle = ''
    newPriority = 'medium'
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') handleAdd()
  }

  function toggleTaskTimer(id: string) {
    if (todos.activeTaskId === id) {
      if (pomodoro.running) pomodoro.pause()
      else pomodoro.start()
    } else {
      todos.selectTask(id)
      pomodoro.setMode('work')
      pomodoro.start()
    }
  }
</script>

<div class="todo-panel">
  <h2 class="todo-heading">Tarefas</h2>

  <div class="add-row">
    <button
      class="priority-dot {newPriority}"
      aria-label="Prioridade da nova tarefa"
      onclick={cycleNewPriority}
      title="Prioridade: {newPriority === 'high' ? 'Alta' : newPriority === 'low' ? 'Baixa' : 'Média'}"
    ></button>
    <input
      class="task-input"
      type="text"
      placeholder="Adicionar tarefa..."
      bind:value={newTitle}
      onkeydown={handleKeydown}
    />
    <button class="btn-add" onclick={handleAdd} disabled={!newTitle.trim()}>+</button>
  </div>

  {#if todos.tasks.length === 0}
    <p class="empty">Nenhuma tarefa. Adicione uma acima!</p>
  {:else}
    <ul class="task-list">
      {#each todos.tasks as task, i (task.id)}
        <li
          class="task-item"
          class:active={todos.activeTaskId === task.id}
          class:done={task.done}
          draggable="true"
          ondragstart={(e) => handleDragStart(e, i)}
          ondragover={handleDragOver}
          ondrop={(e) => handleDrop(e, i)}
        >
          <button
            class="check"
            aria-label={task.done ? 'Marcar como pendente' : 'Marcar como concluída'}
            onclick={() => todos.toggleDone(task.id)}
          >
            {task.done ? '✓' : '○'}
          </button>

          <button
            class="priority-dot {task.priority || 'medium'}"
            aria-label="Alterar prioridade"
            onclick={() => cyclePriority(task)}
            title="Prioridade: {task.priority === 'high' ? 'Alta' : task.priority === 'low' ? 'Baixa' : 'Média'}"
          ></button>

          {#if editingId === task.id}
            <input
              class="task-edit-input"
              bind:value={editTitle}
              onkeydown={handleEditKeydown}
              onblur={saveEdit}
              autofocus
            />
          {:else}
            <span class="task-title" ondblclick={() => startEdit(task)} title="Duplo clique para editar">{task.title}</span>
          {/if}

          <span class="tomatoes" title="{task.pomodoros} pomodoros">
            {#if task.pomodoros > 0}
              {'🍅'.repeat(Math.min(task.pomodoros, 8))}{task.pomodoros > 8 ? ` ×${task.pomodoros}` : ''}
            {/if}
          </span>

          <button
            class="btn-play"
            class:selected={todos.activeTaskId === task.id}
            aria-label={todos.activeTaskId === task.id && pomodoro.running ? 'Pausar pomodoro' : 'Iniciar pomodoro'}
            onclick={() => toggleTaskTimer(task.id)}
            title={todos.activeTaskId === task.id && pomodoro.running ? 'Pausar pomodoro' : 'Iniciar pomodoro'}
          >{todos.activeTaskId === task.id && pomodoro.running ? '⏸' : '▶'}</button>

          <button
            class="btn-remove"
            aria-label="Remover tarefa"
            onclick={() => todos.removeTask(task.id)}
          >✕</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .todo-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    min-width: 320px;
  }

  .todo-heading {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
  }

  .add-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .task-input {
    flex: 1;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .task-input:focus {
    border-color: var(--accent);
  }

  .btn-add {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
  }

  .btn-add:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .empty {
    color: var(--text-muted);
    font-size: 0.875rem;
    text-align: center;
    margin: 2rem 0;
  }

  .task-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .task-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.75rem;
    background: var(--surface);
    border-radius: 8px;
    border: 1px solid transparent;
    transition: border-color 0.2s;
  }

  .task-item.active {
    border-color: var(--accent);
  }

  .task-item.done .task-title {
    text-decoration: line-through;
    color: var(--text-muted);
  }

  .check {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--text-muted);
    width: 24px;
    flex-shrink: 0;
    transition: color 0.2s;
  }

  .check:hover {
    color: var(--accent);
  }

  .task-title {
    flex: 1;
    font-size: 0.9rem;
    color: var(--text);
    word-break: break-word;
    cursor: text;
  }

  .task-edit-input {
    flex: 1;
    font-size: 0.9rem;
    color: var(--text);
    background: var(--bg);
    border: 1px solid var(--accent);
    border-radius: 4px;
    padding: 2px 6px;
    outline: none;
  }

  .tomatoes {
    font-size: 0.75rem;
    flex-shrink: 0;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .btn-play {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    color: var(--text-muted);
    flex-shrink: 0;
    padding: 2px 6px;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
  }

  .btn-play:hover,
  .btn-play.selected {
    color: var(--accent);
    background: var(--surface-hover);
  }

  .btn-remove {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--text-muted);
    flex-shrink: 0;
    padding: 2px 4px;
    border-radius: 4px;
    transition: color 0.2s;
  }

  .btn-remove:hover {
    color: #e05;
  }

  .priority-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    transition: transform 0.2s, opacity 0.2s;
  }
  .priority-dot:hover {
    transform: scale(1.2);
  }
  .priority-dot.low { background: #3b82f6; }
  .priority-dot.medium { background: #eab308; }
  .priority-dot.high { background: #ef4444; }
</style>
