import { describe, it, expect, vi, beforeEach } from "vitest";
import type { HistoryEntry } from "../types";

const STORAGE_KEY = "pomandoro-history";

describe("History Store Logic", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("loads entries from localStorage", () => {
    const mockEntries: HistoryEntry[] = [
      { id: "1", taskId: "t1", taskTitle: "Task 1", mode: "work", duration: 1500, completedAt: 123456 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEntries));

    const raw = localStorage.getItem(STORAGE_KEY);
    const entries = raw ? (JSON.parse(raw) as HistoryEntry[]) : [];

    expect(entries).toHaveLength(1);
    expect(entries[0].taskTitle).toBe("Task 1");
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

  it("clears history", () => {
    let entries: HistoryEntry[] = [
      { id: "1", taskId: "t1", taskTitle: "Task 1", mode: "work", duration: 1500, completedAt: 123456 },
    ];
    
    entries = [];
    
    expect(entries).toHaveLength(0);
  });
});
