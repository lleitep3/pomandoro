import { test, expect } from "@playwright/test";

test.describe("Todo List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Garante que o idioma está em PT-BR para os testes
    await page.evaluate(() => {
      localStorage.setItem('pomandoro-settings', JSON.stringify({
        language: 'pt-BR',
        theme: 'dark',
        durations: { work: 25, 'short-break': 5, 'long-break': 15 }
      }));
    });
    await page.reload();
  });

  test("should add a new task", async ({ page }) => {
    const input = page.locator(".task-input");
    const addBtn = page.locator(".btn-add");

    await input.fill("Test task");
    await addBtn.click();

    const task = page.locator('.task-title:has-text("Test task")');
    await expect(task).toBeVisible();
  });

  test("should not add empty task", async ({ page }) => {
    const addBtn = page.locator(".btn-add");
    const emptyMessage = page.locator(".empty");

    // Botão deve estar desabilitado quando input está vazio
    await expect(addBtn).toBeDisabled();

    // Mensagem de vazio deve continuar visível
    await expect(emptyMessage).toBeVisible();
  });

  test("should toggle task completion", async ({ page }) => {
    const input = page.locator(".task-input");
    const addBtn = page.locator(".btn-add");

    await input.fill("Task to complete");
    await addBtn.click();

    const checkBtn = page.locator(".check").first();
    await checkBtn.click();

    const taskItem = page.locator(".task-item.done");
    await expect(taskItem).toBeVisible();
    await expect(taskItem).toContainText("Task to complete");
  });

  test("should delete a task", async ({ page }) => {
    const input = page.locator(".task-input");
    const addBtn = page.locator(".btn-add");

    await input.fill("Task to delete");
    await addBtn.click();

    const deleteBtn = page.locator(".btn-remove").first();
    await deleteBtn.click();

    const task = page.locator('.task-title:has-text("Task to delete")');
    await expect(task).not.toBeVisible();
  });

  test("should select a task for pomodoro", async ({ page }) => {
    const input = page.locator(".task-input");
    const addBtn = page.locator(".btn-add");

    await input.fill("Active task");
    await addBtn.click();

    // Click no botão play da tarefa
    const playBtn = page.locator(".btn-play").first();
    await playBtn.click();

    // Verifica se o botão play tem a classe 'selected'
    await expect(playBtn).toHaveClass(/selected/);

    // Verifica se o timer iniciou (botão Pausar visível no painel do timer)
    const pauseBtn = page.locator('.timer-panel button:has-text("Pausar")');
    await expect(pauseBtn).toBeVisible();
  });
});
