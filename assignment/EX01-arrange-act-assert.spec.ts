import { test as base, expect } from "@playwright/test";

const baseUrl = "https://katalon-demo-cura.herokuapp.com/";

type LoginFixtures = {
  credentials: {
    valid: { username: string; password: string };
    invalidPassword: { username: string; password: string };
    invalidUsername: { username: string; password: string };
  };
  selectors: {
    usernameInput: string;
    passwordInput: string;
    loginButton: string;
    loginFailedMessage: string;
  };
};

const test = base.extend<LoginFixtures>({
  credentials: async ({}, use) => {
    await use({
      valid: {
        username: "John Doe",
        password: "ThisIsNotAPassword",
      },
      invalidPassword: {
        username: "John Doe",
        password: "WrongPassword",
      },
      invalidUsername: {
        username: "WrongUser",
        password: "ThisIsNotAPassword",
      },
    });
  },
  selectors: async ({}, use) => {
    await use({
      usernameInput: "#txt-username",
      passwordInput: "#txt-password",
      loginButton: "#btn-login",
      loginFailedMessage:
        "Login failed! Please ensure the username and password are valid.",
    });
  },
});

// Arrange Act Assert: Valid login

test("Login passes with valid user", async ({
  page,
  credentials,
  selectors,
}) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();

  // Act
  const usernameInput = page.locator(selectors.usernameInput);
  const passwordInput = page.locator(selectors.passwordInput);
  const loginButton = page.locator(selectors.loginButton);

  await usernameInput.fill(credentials.valid.username);
  await passwordInput.fill(credentials.valid.password);
  await loginButton.click();

  // Assert
  await expect(page).toHaveURL(/appointment/);
  await expect(page.getByRole("heading", { level: 2 })).toHaveText(
    "Make Appointment",
  );
});

// Arrange Act Assert: Invalid password

test("Login fails with invalid password", async ({
  page,
  credentials,
  selectors,
}) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();

  // Act
  const usernameInput = page.locator(selectors.usernameInput);
  const passwordInput = page.locator(selectors.passwordInput);
  const loginButton = page.locator(selectors.loginButton);
  const loginFailedMessage = page
    .locator("p")
    .filter({ hasText: selectors.loginFailedMessage });

  await usernameInput.fill(credentials.invalidPassword.username);
  await passwordInput.fill(credentials.invalidPassword.password);
  await loginButton.click();

  // Assert
  await expect(loginFailedMessage).toBeVisible();
  await expect(loginFailedMessage).toContainText(selectors.loginFailedMessage);
});

// Arrange Act Assert: Invalid username

test("Login fails with invalid username", async ({
  page,
  credentials,
  selectors,
}) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();

  // Act
  const usernameInput = page.locator(selectors.usernameInput);
  const passwordInput = page.locator(selectors.passwordInput);
  const loginButton = page.locator(selectors.loginButton);
  const loginFailedMessage = page
    .locator("p")
    .filter({ hasText: selectors.loginFailedMessage });

  await usernameInput.fill(credentials.invalidUsername.username);
  await passwordInput.fill(credentials.invalidUsername.password);
  await loginButton.click();

  // Assert
  await expect(loginFailedMessage).toBeVisible();
  await expect(loginFailedMessage).toContainText(selectors.loginFailedMessage);
});
