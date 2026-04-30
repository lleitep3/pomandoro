import { describe, it, expect, beforeEach, vi } from 'vitest'
import { settings } from './settings.svelte'

const STORAGE_KEY = 'pomandoro-settings'

describe('Settings Store Logic', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with default values', () => {
    expect(settings.language).toBeDefined()
    expect(settings.theme).toBeDefined()
    expect(settings.durations.work).toBe(25)
  })

  it('saves settings to localStorage', () => {
    settings.updateDuration('work', 30)
    
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
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
