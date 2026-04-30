import type { HistoryEntry } from '../types'

const STORAGE_KEY = 'pomandoro-history'

function loadFromStorage(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

function save(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function createHistoryStore() {
  let entries = $state<HistoryEntry[]>(loadFromStorage())

  return {
    get entries() { return entries },

    addEntry(entry: Omit<HistoryEntry, 'id' | 'completedAt'>) {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        completedAt: Date.now()
      }
      entries = [newEntry, ...entries]
      save(entries)
    },

    clearHistory() {
      entries = []
      save(entries)
    }
  }
}

export const history = createHistoryStore()
