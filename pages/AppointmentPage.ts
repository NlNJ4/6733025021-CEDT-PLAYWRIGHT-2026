import { expect, type Page } from "@playwright/test";

type HealthcareProgram = "Medicare" | "Medicaid" | "None";

type AppointmentData = {
  facility: string;
  applyReadmission: boolean;
  program: HealthcareProgram;
  visitDate: string;
  comment: string;
};

export class AppointmentPage {
  constructor(private readonly page: Page) {}

  async expectMakeAppointmentPage() {
    await expect(this.page).toHaveURL(/appointment/);
    await expect(this.page.getByRole("heading", { level: 2 })).toHaveText(
      "Make Appointment",
    );
  }

  async makeAppointment(data: AppointmentData) {
    await this.page.locator("#combo_facility").selectOption({ label: data.facility });

    const readmissionCheckbox = this.page.locator("#chk_hospotal_readmission");
    if (data.applyReadmission) {
      await readmissionCheckbox.check();
    } else {
      await readmissionCheckbox.uncheck();
    }

    const programSelectorMap: Record<HealthcareProgram, string> = {
      Medicare: "#radio_program_medicare",
      Medicaid: "#radio_program_medicaid",
      None: "#radio_program_none",
    };

    await this.page.locator(programSelectorMap[data.program]).check();
    const visitDateInput = this.page.locator("#txt_visit_date");
    await visitDateInput.evaluate((element, value) => {
      const input = element as HTMLInputElement;
      input.value = String(value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, data.visitDate);
    await this.page.locator("#txt_comment").fill(data.comment);
    await this.page.locator("#btn-book-appointment").click();
  }

  async expectAppointmentConfirmation(data: AppointmentData) {
    await expect(this.page).toHaveURL(/appointment\.php#summary/);
    await expect(this.page.getByRole("heading", { level: 2 })).toHaveText(
      "Appointment Confirmation",
    );
    await expect(this.page.locator("#facility")).toHaveText(data.facility);
    await expect(this.page.locator("#hospital_readmission")).toHaveText(
      data.applyReadmission ? "Yes" : "No",
    );
    await expect(this.page.locator("#program")).toHaveText(data.program);
    await expect(this.page.locator("#visit_date")).toHaveText(data.visitDate);
    await expect(this.page.locator("#comment")).toHaveText(data.comment);
  }
}
