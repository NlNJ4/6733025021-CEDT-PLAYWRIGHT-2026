import { test, expect } from "@playwright/test";

const baseUrl = "https://katalon-demo-cura.herokuapp.com/";

// Arrange Act Assert: Valid login

test("Login passes with valid user", async ({ page }) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();

  // Act
  await page.fill("#txt-username", "John Doe");
  await page.fill("#txt-password", "ThisIsNotAPassword");
  await page.click("#btn-login");

  // Assert
  await expect(page).toHaveURL(/appointment/);
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(
    "Make Appointment",
  );
});

// Arrange Act Assert: Invalid password

test("Login fails with invalid password", async ({ page }) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();

  // Act
  await page.fill("#txt-username", "John Doe");
  await page.fill("#txt-password", "WrongPassword");
  await page.click("#btn-login");

  // Assert
  await expect(
    page
      .locator("p")
      .filter({
        hasText:
          "Login failed! Please ensure the username and password are valid.",
      }),
  ).toBeVisible();
  await expect(
    page
      .locator("p")
      .filter({
        hasText:
          "Login failed! Please ensure the username and password are valid.",
      }),
  ).toContainText(
    "Login failed! Please ensure the username and password are valid.",
  );
});

// Arrange Act Assert: Invalid username

test("Login fails with invalid username", async ({ page }) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();

  // Act
  await page.fill("#txt-username", "WrongUser");
  await page.fill("#txt-password", "ThisIsNotAPassword");
  await page.click("#btn-login");

  // Assert
  await expect(
    page
      .locator("p")
      .filter({
        hasText:
          "Login failed! Please ensure the username and password are valid.",
      }),
  ).toBeVisible();
  await expect(
    page
      .locator("p")
      .filter({
        hasText:
          "Login failed! Please ensure the username and password are valid.",
      }),
  ).toContainText(
    "Login failed! Please ensure the username and password are valid.",
  );
});
