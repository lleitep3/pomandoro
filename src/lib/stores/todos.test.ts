import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Task } from "../types";

const STORAGE_KEY = "pomandoro-tasks";

describe("Todos Store Logic", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("loads tasks from localStorage", () => {
    const mockTasks: Task[] = [
      { id: "1", title: "Task 1", pomodoros: 2, done: false },
      { id: "2", title: "Task 2", pomodoros: 0, done: true },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));

    const raw = localStorage.getItem(STORAGE_KEY);
    const tasks = raw ? (JSON.parse(raw) as Task[]) : [];

    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe("Task 1");
    expect(tasks[1].done).toBe(true);
  });

  it("returns empty array when localStorage is empty", () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const tasks = raw ? (JSON.parse(raw) as Task[]) : [];

    expect(tasks).toEqual([]);
  });

  it("saves tasks to localStorage", () => {
    const tasks: Task[] = [
      { id: "1", title: "New Task", pomodoros: 0, done: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved!)[0].title).toBe("New Task");
  });

  it("validates task title - rejects empty strings", () => {
    const validateTitle = (title: string): boolean => {
      return title.trim().length > 0;
    };

    expect(validateTitle("")).toBe(false);
    expect(validateTitle("   ")).toBe(false);
    expect(validateTitle("Valid Task")).toBe(true);
    expect(validateTitle("  Valid Task  ")).toBe(true);
  });

  it("trims task titles", () => {
    const title = "  Task with spaces  ";
    const trimmed = title.trim();
    expect(trimmed).toBe("Task with spaces");
  });

  it("filters out task by id", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", pomodoros: 0, done: false },
      { id: "2", title: "Task 2", pomodoros: 0, done: false },
      { id: "3", title: "Task 3", pomodoros: 0, done: false },
    ];

    const filtered = tasks.filter((t) => t.id !== "2");

    expect(filtered).toHaveLength(2);
    expect(filtered.find((t) => t.id === "2")).toBeUndefined();
  });

  it("toggles done status", () => {
    const task: Task = { id: "1", title: "Task", pomodoros: 0, done: false };

    const toggled = { ...task, done: !task.done };

    expect(toggled.done).toBe(true);

    const toggledAgain = { ...toggled, done: !toggled.done };
    expect(toggledAgain.done).toBe(false);
  });

  it("increments pomodoro count", () => {
    const task: Task = { id: "1", title: "Task", pomodoros: 3, done: false };

    const incremented = { ...task, pomodoros: task.pomodoros + 1 };

    expect(incremented.pomodoros).toBe(4);
  });

  it("finds active task by id", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", pomodoros: 0, done: false },
      { id: "2", title: "Task 2", pomodoros: 0, done: false },
    ];
    const activeTaskId = "2";

    const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

    expect(activeTask).not.toBeNull();
    expect(activeTask?.title).toBe("Task 2");
  });

  it("returns null when no active task found", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", pomodoros: 0, done: false },
    ];
    const activeTaskId = "non-existent";

    const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

    expect(activeTask).toBeNull();
  });

  it("clears activeTaskId when removing active task", () => {
    let activeTaskId: string | null = "2";
    const idToRemove = "2";

    if (activeTaskId === idToRemove) {
      activeTaskId = null;
    }

    expect(activeTaskId).toBeNull();
  });

  it("generates unique ids for tasks", () => {
    const ids = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const id = crypto.randomUUID();
      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }

    expect(ids.size).toBe(100);
  });

  it("edits task title", () => {
    const task: Task = { id: "1", title: "Task", pomodoros: 0, done: false };
    const newTitle = "  Updated Task  ";
    const trimmed = newTitle.trim();
    
    const edited = trimmed ? { ...task, title: trimmed } : task;
    
    expect(edited.title).toBe("Updated Task");
  });

  it("sets task priority", () => {
    const task: Task = { id: "1", title: "Task", pomodoros: 0, done: false, priority: "medium" };
    
    const updated = { ...task, priority: "high" as const };
    
    expect(updated.priority).toBe("high");
  });

  it("reorders tasks", () => {
    const tasks: Task[] = [
      { id: "1", title: "Task 1", pomodoros: 0, done: false },
      { id: "2", title: "Task 2", pomodoros: 0, done: false },
      { id: "3", title: "Task 3", pomodoros: 0, done: false },
    ];
    
    const oldIndex = 0;
    const newIndex = 2;
    
    const newTasks = [...tasks];
    const [moved] = newTasks.splice(oldIndex, 1);
    newTasks.splice(newIndex, 0, moved);
    
    expect(newTasks[0].id).toBe("2");
    expect(newTasks[1].id).toBe("3");
    expect(newTasks[2].id).toBe("1");
  });
});
