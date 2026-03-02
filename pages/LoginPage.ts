import type { Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string) {
    await this.page.locator("#txt-username").fill(username);
    await this.page.locator("#txt-password").fill(password);
    await this.page.locator("#btn-login").click();
  }
}
