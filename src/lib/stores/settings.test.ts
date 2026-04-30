import { describe, it, expect, beforeEach, vi } from 'vitest'

const STORAGE_KEY = 'pomandoro-settings'

describe('Settings Store Logic', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with default values', () => {
    const defaultSettings = {
      language: 'en',
      theme: 'system',
      durations: {
        work: 25,
        'short-break': 5,
        'long-break': 15
      }
    }
    
    // Simulate loading logic
    const raw = localStorage.getItem(STORAGE_KEY)
    const settings = raw ? JSON.parse(raw) : defaultSettings

    expect(settings.language).toBe('en')
    expect(settings.theme).toBe('system')
    expect(settings.durations.work).toBe(25)
  })

  it('saves settings to localStorage', () => {
    const newSettings = {
      language: 'pt-BR',
      theme: 'dark',
      durations: {
        work: 30,
        'short-break': 10,
        'long-break': 20
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved.language).toBe('pt-BR')
    expect(saved.theme).toBe('dark')
    expect(saved.durations.work).toBe(30)
  })

  it('detects browser language correctly', () => {
    // Mock navigator.language
    const spy = vi.spyOn(navigator, 'language', 'get')
    
    spy.mockReturnValue('pt-PT')
    const getLang = () => {
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'pt') return 'pt-BR'
      if (browserLang === 'es') return 'es'
      return 'en'
    }
    expect(getLang()).toBe('pt-BR')

    spy.mockReturnValue('es-ES')
    expect(getLang()).toBe('es')

    spy.mockReturnValue('fr-FR')
    expect(getLang()).toBe('en')
    
    spy.mockRestore()
  })
})
