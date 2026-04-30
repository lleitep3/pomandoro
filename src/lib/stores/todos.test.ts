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

});
