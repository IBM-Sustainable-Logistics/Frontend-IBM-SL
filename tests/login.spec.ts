import { test, expect } from "@playwright/test";

const url = "http://localhost:8000";
const email = "_";
const password = "_";

test("xan login and see dashboard", async ({ page }) => {
  try {
    await page.goto(url);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByLabel("Email").click();
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").click();
    await page.getByLabel("Password").fill(password);
    await page.locator("form").getByRole("button", { name: "Sign In" }).click();
    // await page.waitForTimeout(3000);
    await expect(page.getByText("My Projects")).toBeVisible();
  } catch (error) {
    console.error("Test failed during title check", error);
    throw error; // Rethrow if you want the test to fail
  }
});

// test('get started link', async ({ page }) => {
//   try {
//     await page.goto('https://playwright.dev/');
//     await page.getByRole('link', { name: 'Get started' }).click();
//     await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
//   } catch (error) {
//     console.error('Test failed during "get started link" check', error);
//     throw error; // Rethrow if you want the test to fail
//   }
// });
