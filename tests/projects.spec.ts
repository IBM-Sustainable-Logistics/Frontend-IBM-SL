import { test, expect } from "@playwright/test";

const url = "http://localhost:8000";
const email = "dummy@gmail.com";
const password = "qwerty";

test("can login and see dashboard", async ({ page }) => {
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

const dateTimeUnix = Date.now();
const projectTitle = "Test Project " + dateTimeUnix;
const projectDescription =
  "Project test made in playwright: timestamp: " + dateTimeUnix;

test("can create a project", async ({ page }) => {
  try {
    await page.goto(url);
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByLabel("Email").click();
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").click();
    await page.getByLabel("Password").fill(password);
    await page.locator("form").getByRole("button", { name: "Sign In" }).click();
    await page.getByText("Create a project").click();
    await page.getByPlaceholder("Title").click();
    await page.getByPlaceholder("Title").fill(projectTitle);
    await page.getByPlaceholder("Description").click();
    await page.getByPlaceholder("Description").fill(projectDescription);
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText(projectTitle, { exact: true })).toBeVisible();
    await expect(page.getByText(projectDescription)).toBeVisible();
  } catch (error) {
    console.error("Test failed during title check", error);
    throw error; // Rethrow if you want the test to fail
  }
});

test("can delete a project", async ({ page }) => {
  await page.goto(url);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(password);
  await page.locator("form").getByRole("button", { name: "Sign In" }).click();

  try {
    // Ensure the project's title and description are visible
    await expect(page.getByText(projectTitle, { exact: true })).toBeVisible();
    await expect(page.getByText(projectDescription)).toBeVisible();

    // Identify the delete button within the card, using either text or an icon's alt text or some other unique property
    const deleteButton = await page.locator("button > .inline-flex").first();

    await deleteButton.click();

    await expect(
      page.getByRole("heading", { name: "Delete project 'Test Project" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Delete" }).click();
    await page.waitForTimeout(3000);
    await expect(page.getByText(projectTitle)).not.toBeVisible();
  } catch (error) {
    console.error("Test failed", error);
    throw error; // Rethrow if you want the test to fail
  }
});
