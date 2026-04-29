import { test, expect } from "@playwright/test";

test.describe("Pomodoro Timer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display initial timer at 25:00", async ({ page }) => {
    const timer = page.locator(".time");
    await expect(timer).toContainText("25:00");
  });

  test("should start and pause timer", async ({ page }) => {
    const startBtn = page.locator(".btn-primary");
    const pauseBtn = page.locator(".btn-secondary");

    await startBtn.click();
    await expect(pauseBtn).toBeVisible();

    await page.waitForTimeout(1000);
    const timer = page.locator(".time");
    const text = await timer.textContent();
    expect(text).not.toBe("25:00");

    await pauseBtn.click();
    await expect(startBtn).toBeVisible();
  });

  test("should reset timer", async ({ page }) => {
    const startBtn = page.locator(".btn-primary");
    const resetBtn = page.locator(".btn-ghost");

    await startBtn.click();
    await page.waitForTimeout(2000);
    await resetBtn.click();

    const timer = page.locator(".time");
    await expect(timer).toContainText("25:00");
  });

  test("should switch between timer modes", async ({ page }) => {
    const shortBreakBtn = page.locator('.mode-tab:has-text("Pausa")');
    const longBreakBtn = page.locator('.mode-tab:has-text("Descanso")');
    const workBtn = page.locator('.mode-tab:has-text("Foco")');

    await shortBreakBtn.click();
    const timer1 = page.locator(".time");
    await expect(timer1).toContainText("05:00");

    await longBreakBtn.click();
    const timer2 = page.locator(".time");
    await expect(timer2).toContainText("15:00");

    await workBtn.click();
    const timer3 = page.locator(".time");
    await expect(timer3).toContainText("25:00");
  });
});
