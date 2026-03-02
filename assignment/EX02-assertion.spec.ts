import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const baseUrl = "https://katalon-demo-cura.herokuapp.com/";
const validUser = { username: "John Doe", password: "ThisIsNotAPassword" };

type Fixtures = {
  loggedInPage: Page;
};

const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto(baseUrl);
    await page.getByRole("link", { name: "Make Appointment" }).click();
    await page.fill("#txt-username", validUser.username);
    await page.fill("#txt-password", validUser.password);
    await page.click("#btn-login");
    await use(page);
  },
});

test("Make Appointment page displays correct h2", async ({ loggedInPage }) => {
  await expect(loggedInPage.getByRole("heading", { level: 2 })).toHaveText(
    "Make Appointment",
  );
});

test("Can select all facility combo boxes", async ({ loggedInPage }) => {
  const facilitySelect = loggedInPage.locator("#combo_facility");
  const options = await facilitySelect.locator("option").evaluateAll((nodes) =>
    nodes.map((node) => ({
      label: (node as HTMLOptionElement).label,
      value: (node as HTMLOptionElement).value,
    })),
  );

  for (const option of options) {
    await facilitySelect.selectOption({ label: option.label });
    await expect(facilitySelect).toHaveValue(option.value);
  }
});

test("Can select apply for hospital readmission checkbox", async ({
  loggedInPage,
}) => {
  const checkbox = loggedInPage.locator("#chk_hospotal_readmission");
  await checkbox.check();
  await expect(checkbox).toBeChecked();
});

test("Can select health care program radio button", async ({
  loggedInPage,
}) => {
  const radioButtons = [
    "#radio_program_medicare",
    "#radio_program_medicaid",
    "#radio_program_none",
  ];

  for (const radio of radioButtons) {
    await loggedInPage.locator(radio).check();
    await expect(loggedInPage.locator(radio)).toBeChecked();
  }
});

test("Can input current date on Visit Date", async ({ loggedInPage }) => {
  const now = new Date();
  const currentDate = [
    String(now.getDate()).padStart(2, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getFullYear()),
  ].join("/");

  await loggedInPage.fill("#txt_visit_date", currentDate);
  await expect(loggedInPage.locator("#txt_visit_date")).toHaveValue(
    currentDate,
  );
});

test("Can input comment", async ({ loggedInPage }) => {
  const comment = "This is a test comment.";
  await loggedInPage.fill("#txt_comment", comment);
  await expect(loggedInPage.locator("#txt_comment")).toHaveValue(comment);
});

test("Book appointment button is displayed and enabled", async ({
  loggedInPage,
}) => {
  const bookBtn = loggedInPage.locator("#btn-book-appointment");
  await expect(bookBtn).toBeVisible();
  await expect(bookBtn).toBeEnabled();
});
