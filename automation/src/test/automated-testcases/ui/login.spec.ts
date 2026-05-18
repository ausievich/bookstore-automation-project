/**
 * Domain: Online Bookstore
 * Feature: User Login
 * Owner: bookstore-qa
 * Test Description: Login validation scenarios
 */
import { test } from '@automation/test/test-base/fixtures';
import { LoginSteps } from '@automation/main/ui/steps/login.steps';
import { TestUsers } from '@automation/main/common/constants/credentials';
import { Owner, allure } from '@automation/main/common/annotations';

test.describe('User Login', () => {
  test.beforeEach(async () => {
    await allure.owner(Owner.Bookstore);
    await allure.feature('Login');
  });

  test('@TmsLink:C1001 valid login shows catalog dashboard', async ({ page }) => {
    const steps = new LoginSteps(page);
    await steps.loginAsValidUser(TestUsers.valid.email, TestUsers.valid.password);
    await steps.expectDashboardVisible();
  });

  test('@TmsLink:C1002 invalid password shows error', async ({ page }) => {
    const steps = new LoginSteps(page);
    await steps.loginAs(TestUsers.valid.email, TestUsers.invalidPassword.password);
    await steps.expectLoginError();
  });

  test('@TmsLink:C1003 empty fields show validation messages', async ({ page }) => {
    const steps = new LoginSteps(page);
    await steps.submitEmptyLogin();
    await steps.expectValidationMessages();
  });
});
