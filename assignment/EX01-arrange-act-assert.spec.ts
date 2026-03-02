import { test as base, expect, type Page } from "@playwright/test";

const baseUrl = "https://katalon-demo-cura.herokuapp.com/";

type LoginFixtures = {
  validUsername: string;
  validPassword: string;
  invalidUsername: string;
  invalidPassword: string;
};

const test = base.extend<LoginFixtures>({
  validUsername: "John Doe",
  validPassword: "ThisIsNotAPassword",
  invalidUsername: "WrongUser",
  invalidPassword: "WrongPassword",
});

const getLoginLocators = (page: Page) => {
  const usernameInput = page.locator("#txt-username");
  const passwordInput = page.locator("#txt-password");
  const loginButton = page.locator("#btn-login");

  return {
    usernameInput,
    passwordInput,
    loginButton,
  };
};

// Arrange Act Assert: Valid login

test("Login passes with valid user", async ({
  page,
  validUsername,
  validPassword,
}) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();
  const { usernameInput, passwordInput, loginButton } = getLoginLocators(page);

  // Act
  await usernameInput.fill(validUsername);
  await passwordInput.fill(validPassword);
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
  validUsername,
  invalidPassword,
}) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();
  const { usernameInput, passwordInput, loginButton } = getLoginLocators(page);

  // Act
  await usernameInput.fill(validUsername);
  await passwordInput.fill(invalidPassword);
  await loginButton.click();

  // Assert
  await expect(
    page.locator("p").filter({
      hasText:
        "Login failed! Please ensure the username and password are valid.",
    }),
  ).toBeVisible();
  await expect(
    page.locator("p").filter({
      hasText:
        "Login failed! Please ensure the username and password are valid.",
    }),
  ).toContainText(
    "Login failed! Please ensure the username and password are valid.",
  );
});

// Arrange Act Assert: Invalid username

test("Login fails with invalid username", async ({
  page,
  invalidUsername,
  validPassword,
}) => {
  // Arrange
  await page.goto(baseUrl);
  await page.getByRole("link", { name: "Make Appointment" }).click();
  const { usernameInput, passwordInput, loginButton } = getLoginLocators(page);

  // Act
  await usernameInput.fill(invalidUsername);
  await passwordInput.fill(validPassword);
  await loginButton.click();

  // Assert
  await expect(
    page.locator("p").filter({
      hasText:
        "Login failed! Please ensure the username and password are valid.",
    }),
  ).toBeVisible();
  await expect(
    page.locator("p").filter({
      hasText:
        "Login failed! Please ensure the username and password are valid.",
    }),
  ).toContainText(
    "Login failed! Please ensure the username and password are valid.",
  );
});
