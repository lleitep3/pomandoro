import { describe, it, expect, vi, beforeEach } from "vitest";
import { todos } from "./todos.svelte";
import type { Task } from "../types";

const STORAGE_KEY = "pomandoro-tasks";

describe("Todos Store Logic", () => {
  beforeEach(() => {
    localStorage.clear();
    todos.clear();
    vi.clearAllMocks();
  });

  it("loads tasks from localStorage", () => {
    const mockTasks: Task[] = [
      { id: "1", title: "Task 1", pomodoros: 2, done: false },
      { id: "2", title: "Task 2", pomodoros: 0, done: true },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
    
    todos.load();

    expect(todos.tasks).toHaveLength(2);
    expect(todos.tasks[0].title).toBe("Task 1");
  });

  it("adds a task", () => {
    todos.addTask("Task 3");
    expect(todos.tasks).toHaveLength(1);
    expect(todos.tasks[0].title).toBe("Task 3");
  });

  it("edits task title", () => {
    todos.addTask("Original");
    const id = todos.tasks[0].id;
    todos.editTask(id, "Updated");
    expect(todos.tasks[0].title).toBe("Updated");
  });

  it("removes a task", () => {
    todos.addTask("To remove");
    const id = todos.tasks[0].id;
    todos.removeTask(id);
    expect(todos.tasks).toHaveLength(0);
  });

  it("toggles done status", () => {
    todos.addTask("Task");
    const id = todos.tasks[0].id;
    todos.toggleDone(id);
    expect(todos.tasks[0].done).toBe(true);
    todos.toggleDone(id);
    expect(todos.tasks[0].done).toBe(false);
  });

  it("increments pomodoro count", () => {
    todos.addTask("Task");
    const id = todos.tasks[0].id;
    todos.incrementPomodoro(id);
    expect(todos.tasks[0].pomodoros).toBe(1);
    
    // Test with non-existent id to cover that path
    todos.incrementPomodoro("invalid");
    expect(todos.tasks[0].pomodoros).toBe(1);
  });

  it("selects active task", () => {
    todos.addTask("Task");
    const id = todos.tasks[0].id;
    todos.selectTask(id);
    expect(todos.activeTaskId).toBe(id);
    
    // Select same task again
    todos.selectTask(id);
    expect(todos.activeTaskId).toBe(id);
  });

  it("reorders tasks", () => {
    todos.addTask("Task 1");
    todos.addTask("Task 2");
    todos.reorderTasks(0, 1);
    expect(todos.tasks[0].title).toBe("Task 2");
  });

  it("selects task and updates timer state", () => {
    todos.addTask("Task 1");
    const id = todos.tasks[0].id;
    todos.selectTask(id);
    todos.updateTimerState(id, "short-break", 300);
    expect(todos.tasks[0].timerMode).toBe("short-break");
    expect(todos.tasks[0].timerRemaining).toBe(300);
  });

  it("sets priority", () => {
    todos.addTask("Priority Task");
    const id = todos.tasks[0].id;
    todos.setPriority(id, "high");
    expect(todos.tasks[0].priority).toBe("high");
  });

  it("updates all tasks proportionally", () => {
    todos.addTask("Proportional Task");
    const id = todos.tasks[0].id;
    todos.updateTimerState(id, "work", 1500);
    
    // Add another task that shouldn't be updated (wrong mode)
    todos.addTask("Other Task");
    todos.updateTimerState(todos.tasks[1].id, "short-break", 300);
    
    todos.updateAllTasksProportionally(1500, 3000, "work");
    expect(todos.tasks[0].timerRemaining).toBe(3000);
    expect(todos.tasks[1].timerRemaining).toBe(300);
    
    // Cover early return
    todos.updateAllTasksProportionally(0, 3000, "work");
    expect(todos.tasks[0].timerRemaining).toBe(3000);
  });

  it("handles empty titles and invalid indices", () => {
    todos.addTask("   ");
    expect(todos.tasks).toHaveLength(0);
    
    todos.addTask("Valid");
    todos.editTask(todos.tasks[0].id, "   ");
    expect(todos.tasks[0].title).toBe("Valid");
    
    todos.reorderTasks(-1, 10);
    expect(todos.tasks).toHaveLength(2);
  });

  it("handles tasks without timer state in proportional update", () => {
    todos.addTask("No Timer");
    // This task has timerMode undefined by default
    todos.updateAllTasksProportionally(1500, 3000, "work");
    expect(todos.tasks[2].timerRemaining).toBeUndefined();
  });
});
