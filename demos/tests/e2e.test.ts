import { test, expect } from "@playwright/test";

const PAGE_URL = "http://localhost:3002?demo=e2e";

test.describe("useNextTick", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    await page.waitForTimeout(200);
  });

  test("reads correct DOM value after state update", async ({ page }) => {
    await page.getByTestId("increment").click();
    await expect(page.getByTestId("log-0")).toHaveText("tick:1");

    await page.getByTestId("increment").click();
    await expect(page.getByTestId("log-1")).toHaveText("tick:2");
  });

  test("async callback fires correctly", async ({ page }) => {
    await page.getByTestId("async").click();

    await expect(page.getByTestId("counter")).toHaveText("1");
    await expect(page.getByTestId("log-0")).toHaveText("async:done");
  });

  test("reads conditional mount/unmount correctly", async ({ page }) => {
    await page.getByTestId("toggle").click();
    await expect(page.getByTestId("log-0")).toHaveText("box:mounted");

    await page.getByTestId("toggle").click();
    await expect(page.getByTestId("log-1")).toHaveText("box:gone");
  });

  test("reads correct DOM order after list reversal", async ({ page }) => {
    await page.getByTestId("reverse").click();
    await expect(page.getByTestId("log-0")).toHaveText("order:C,B,A");

    await page.getByTestId("reverse").click();
    await expect(page.getByTestId("log-1")).toHaveText("order:A,B,C");
  });

  test("chained nextTick: callback triggers another nextTick", async ({
    page,
  }) => {
    await page.getByTestId("chain").click();

    await expect(page.getByTestId("log-0")).toHaveText(/^chain:1:\d+$/);
    await expect(page.getByTestId("log-1")).toHaveText(/^chain:2:\d+$/);

    const v1 = Number(
      (await page.getByTestId("log-0").textContent())!.split(":").pop()
    );
    const v2 = Number(
      (await page.getByTestId("log-1").textContent())!.split(":").pop()
    );
    expect(v2).toBe(v1 + 1);
  });
});
