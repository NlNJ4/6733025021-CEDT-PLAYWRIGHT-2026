import { test, expect, type Page } from "@playwright/test";

class HomePage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto("/");
  }

  async clickMakeAppointment() {
    await this.page.getByRole("link", { name: "Make Appointment" }).click();
  }
}

class LoginPage {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string) {
    await this.page.fill("#txt-username", username);
    await this.page.fill("#txt-password", password);
    await this.page.click("#btn-login");
  }
}

class AppointmentPage {
  constructor(private readonly page: Page) {}

  async makeAppointment(details: {
    facility: string;
    readmission: boolean;
    program: "Medicare" | "Medicaid" | "None";
    visitDate: string;
    comment: string;
  }) {
    await this.page.selectOption("#combo_facility", {
      label: details.facility,
    });

    if (details.readmission) {
      await this.page.check("#chk_hospotal_readmission");
    }

    await this.page.getByLabel(details.program).check();
    await this.page.locator("#txt_visit_date").evaluate((node, visitDate) => {
      const input = node as HTMLInputElement;
      input.value = visitDate;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, details.visitDate);
    await expect(this.page.locator("#txt_visit_date")).toHaveValue(
      details.visitDate,
    );
    await this.page.fill("#txt_comment", details.comment);
    await this.page.click("#btn-book-appointment");
  }
}

class AppointmentSummaryPage {
  constructor(private readonly page: Page) {}

  async expectSuccess(details: {
    facility: string;
    readmission: string;
    program: string;
    visitDate: string;
    comment: string;
  }) {
    await expect(this.page).toHaveURL(/appointment\.php#summary/);
    await expect(
      this.page.getByRole("heading", { name: "Appointment Confirmation" }),
    ).toBeVisible();

    await expect(this.page.locator("#facility")).toHaveText(details.facility);
    await expect(this.page.locator("#hospital_readmission")).toHaveText(
      details.readmission,
    );
    await expect(this.page.locator("#program")).toHaveText(details.program);
    await expect(this.page.locator("#visit_date")).toHaveText(
      details.visitDate,
    );
    await expect(this.page.locator("#comment")).toHaveText(details.comment);
  }
}

test("Make appointment success with Page Object Model", async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const appointmentPage = new AppointmentPage(page);
  const summaryPage = new AppointmentSummaryPage(page);

  const credentials = {
    username: "John Doe",
    password: "ThisIsNotAPassword",
  };

  const now = new Date();
  now.setDate(now.getDate() + 1);
  const nextDate = [
    String(now.getDate()).padStart(2, "0"),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getFullYear()),
  ].join("/");

  const appointment = {
    facility: "Seoul CURA Healthcare Center",
    readmission: true,
    program: "Medicaid" as const,
    visitDate: nextDate,
    comment: "Follow-up for annual checkup",
  };

  await homePage.open();
  await homePage.clickMakeAppointment();
  await loginPage.login(credentials.username, credentials.password);
  await appointmentPage.makeAppointment(appointment);

  await summaryPage.expectSuccess({
    facility: appointment.facility,
    readmission: "Yes",
    program: appointment.program,
    visitDate: appointment.visitDate,
    comment: appointment.comment,
  });
});
