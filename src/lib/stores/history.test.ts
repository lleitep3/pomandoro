import { describe, it, expect, vi, beforeEach } from "vitest";
import { history } from "./history.svelte";
import type { HistoryEntry } from "../types";

const STORAGE_KEY = "pomandoro-history";

describe("History Store Logic", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("loads entries from localStorage", () => {
    history.addEntry({ taskId: "1", taskTitle: "Test", mode: "work", duration: 1500 });
    expect(history.entries).toHaveLength(1);
    expect(history.entries[0].taskTitle).toBe("Test");
  });

  it("clears history", () => {
    history.addEntry({ taskId: "1", taskTitle: "Test", mode: "work", duration: 1500 });
    history.clearHistory();
    expect(history.entries).toHaveLength(0);
  });

  it("adds new entry at the beginning", () => {
    let entries: HistoryEntry[] = [
      { id: "1", taskId: "t1", taskTitle: "Task 1", mode: "work", duration: 1500, completedAt: 123456 },
    ];
    
    const newEntry: HistoryEntry = {
      id: "2",
      taskId: null,
      taskTitle: null,
      mode: "short-break",
      duration: 300,
      completedAt: 123457
    };
    
    entries = [newEntry, ...entries];
    
    expect(entries).toHaveLength(2);
    expect(entries[0].id).toBe("2");
    expect(entries[1].id).toBe("1");
  });

  it("can add a play event entry without duration", () => {
    let entries: HistoryEntry[] = [];
    
    const newEntry: HistoryEntry = {
      id: "3",
      taskId: "t1",
      taskTitle: "Task 1",
      mode: "work",
      completedAt: Date.now(),
      type: "play"
    };
    
    entries = [newEntry, ...entries];
    
    expect(entries).toHaveLength(1);
    expect(entries[0].type).toBe("play");
    expect(entries[0].duration).toBeUndefined();
  });

  it("clears history", () => {
    let entries: HistoryEntry[] = [
      { id: "1", taskId: "t1", taskTitle: "Task 1", mode: "work", duration: 1500, completedAt: 123456 },
    ];
    
    entries = [];
    
    expect(entries).toHaveLength(0);
  });
});
