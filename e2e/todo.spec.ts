import { test, expect } from '@playwright/test'

test.describe('Todo List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should add a new task', async ({ page }) => {
    const input = page.locator('input[placeholder*="tarefa"], input[placeholder*="task"]').first()
    const addBtn = page.locator('button:has-text("Adicionar")').first()

    await input.fill('Test task')
    await addBtn.click()

    const task = page.locator('text=Test task')
    await expect(task).toBeVisible()
  })

  test('should not add empty task', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Adicionar")').first()
    const taskList = page.locator('.task-list, [data-testid="task-list"]').first()

    const countBefore = await taskList.locator('> *').count()
    await addBtn.click()
    const countAfter = await taskList.locator('> *').count()

    expect(countAfter).toBe(countBefore)
  })

  test('should toggle task completion', async ({ page }) => {
    const input = page.locator('input[placeholder*="tarefa"], input[placeholder*="task"]').first()
    const addBtn = page.locator('button:has-text("Adicionar")').first()

    await input.fill('Task to complete')
    await addBtn.click()

    const checkbox = page.locator('input[type="checkbox"]').first()
    await checkbox.click()

    const task = page.locator('text=Task to complete')
    await expect(task).toHaveClass(/done|completed|strike/)
  })

  test('should delete a task', async ({ page }) => {
    const input = page.locator('input[placeholder*="tarefa"], input[placeholder*="task"]').first()
    const addBtn = page.locator('button:has-text("Adicionar")').first()

    await input.fill('Task to delete')
    await addBtn.click()

    const deleteBtn = page.locator('button:has-text("Deletar"), button:has-text("Excluir"), button[aria-label*="delete"], button[aria-label*="excluir"]').first()
    await deleteBtn.click()

    const task = page.locator('text=Task to delete')
    await expect(task).not.toBeVisible()
  })

  test('should select a task for pomodoro', async ({ page }) => {
    const input = page.locator('input[placeholder*="tarefa"], input[placeholder*="task"]').first()
    const addBtn = page.locator('button:has-text("Adicionar")').first()

    await input.fill('Active task')
    await addBtn.click()

    const taskRow = page.locator('text=Active task').locator('..').first()
    await taskRow.click()

    const selected = page.locator('.selected, [data-selected="true"]').first()
    await expect(selected).toContainText('Active task')
  })
})
