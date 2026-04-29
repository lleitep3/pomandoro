import { test, expect } from '@playwright/test'

test.describe('App', () => {
  test('should display logo and app name', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.navbar')).toContainText('PoMandoro')
  })

  test('should have timer and todo sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.timer-section')).toBeVisible()
    await expect(page.locator('.todo-section')).toBeVisible()
  })
})
