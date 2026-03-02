import { test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { AppointmentPage } from "../pages/AppointmentPage";

test("Cura Healthcare - an appointment successfully", async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const appointmentPage = new AppointmentPage(page);

  const appointmentData = {
    facility: "Tokyo CURA Healthcare Center",
    applyReadmission: true,
    program: "Medicaid" as const,
    visitDate: "30/03/2026",
    comment: "Book by Playwright POM",
  };

  await homePage.goto();
  await homePage.clickMakeAppointment();
  await loginPage.login("John Doe", "ThisIsNotAPassword");
  await appointmentPage.expectMakeAppointmentPage();
  await appointmentPage.makeAppointment(appointmentData);
  await appointmentPage.expectAppointmentConfirmation(appointmentData);
});
