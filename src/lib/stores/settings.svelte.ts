import { translations, type Language } from '../i18n/translations'

export type Theme = 'dark' | 'light' | 'system'

interface SettingsState {
  language: Language
  theme: Theme
  durations: {
    work: number
    'short-break': number
    'long-break': number
  }
}

const STORAGE_KEY = 'pomandoro-settings'

function getInitialLanguage(): Language {
  const browserLang = navigator.language.split('-')[0]
  if (browserLang === 'pt') return 'pt-BR'
  if (browserLang === 'es') return 'es'
  return 'en'
}

const DEFAULT_SETTINGS: SettingsState = {
  language: getInitialLanguage(),
  theme: 'system',
  durations: {
    work: 25,
    'short-break': 5,
    'long-break': 15
  }
}

function loadFromStorage(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveToStorage(state: SettingsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function createSettingsStore() {
  let state = $state<SettingsState>(loadFromStorage())

  // i18n derived state
  const t = (key: keyof typeof translations['en']) => {
    return translations[state.language][key] || translations['en'][key]
  }

  return {
    get language() { return state.language },
    set language(v: Language) { 
      state.language = v
      saveToStorage(state)
    },
    
    get theme() { return state.theme },
    set theme(v: Theme) {
      state.theme = v
      saveToStorage(state)
    },

    get durations() { return state.durations },
    
    updateDuration(mode: 'work' | 'short-break' | 'long-break', minutes: number) {
      state.durations[mode] = minutes
      saveToStorage(state)
    },

    reset() {
      state.language = getInitialLanguage()
      state.theme = 'system'
      state.durations = { ...DEFAULT_SETTINGS.durations }
      saveToStorage(state)
    },

    t
  }
}

export const settings = createSettingsStore()
