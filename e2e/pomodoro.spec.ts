import { test, expect } from '@playwright/test'

test.describe('Pomodoro Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display initial timer at 25:00', async ({ page }) => {
    const timer = page.locator('.timer-display')
    await expect(timer).toContainText('25:00')
  })

  test('should start and pause timer', async ({ page }) => {
    const startBtn = page.locator('button:has-text("Iniciar")')
    const pauseBtn = page.locator('button:has-text("Pausar")')

    await startBtn.click()
    await expect(pauseBtn).toBeVisible()

    await page.waitForTimeout(1000)
    const timer = page.locator('.timer-display')
    const text = await timer.textContent()
    expect(text).not.toBe('25:00')

    await pauseBtn.click()
    await expect(startBtn).toBeVisible()
  })

  test('should reset timer', async ({ page }) => {
    const startBtn = page.locator('button:has-text("Iniciar")')
    const resetBtn = page.locator('button:has-text("Resetar")')

    await startBtn.click()
    await page.waitForTimeout(2000)
    await resetBtn.click()

    const timer = page.locator('.timer-display')
    await expect(timer).toContainText('25:00')
  })

  test('should switch between timer modes', async ({ page }) => {
    const shortBreakBtn = page.locator('button:has-text("Pausa Curta")')
    const longBreakBtn = page.locator('button:has-text("Pausa Longa")')
    const workBtn = page.locator('button:has-text("Foco")')

    await shortBreakBtn.click()
    const timer1 = page.locator('.timer-display')
    await expect(timer1).toContainText('05:00')

    await longBreakBtn.click()
    const timer2 = page.locator('.timer-display')
    await expect(timer2).toContainText('15:00')

    await workBtn.click()
    const timer3 = page.locator('.timer-display')
    await expect(timer3).toContainText('25:00')
  })
})
