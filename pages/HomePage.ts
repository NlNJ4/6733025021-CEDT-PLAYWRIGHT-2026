import type { Page } from "@playwright/test";

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async clickMakeAppointment() {
    await this.page.getByRole("link", { name: "Make Appointment" }).click();
  }
}
