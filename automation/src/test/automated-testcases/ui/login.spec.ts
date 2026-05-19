/**
 * Domain: Online Bookstore
 * Feature: User Login
 * Owner: bookstore-qa
 * Test Description: Login validation scenarios
 */
import { test } from '@automation/test/test-base/fixtures';
import { LoginSteps } from '@automation/main/ui/steps/login.steps';
import { TestUsers } from '@automation/main/common/constants/credentials';
import { Owner, allureMetadata } from '@automation/main/common/annotations';

test.describe('User Login', () => {
  test.beforeEach(async () => {
    await allureMetadata({ layer: 'UI', owner: Owner.Bookstore });
  });

  test('@TmsLink:C1001 valid login shows catalog dashboard', async ({ page }) => {
    const steps = new LoginSteps(page);

    await test.step('Open login page', async () => {
      await steps.openLogin();
    });

    await test.step('Submit valid credentials', async () => {
      await steps.submitCredentials(TestUsers.valid.email, TestUsers.valid.password);
    });

    await test.step('Wait for catalog redirect', async () => {
      await steps.waitForCatalogRedirect();
    });

    await test.step('Verify catalog dashboard', async () => {
      await steps.expectDashboardVisible();
    });
  });

  test('@TmsLink:C1002 invalid password shows error', async ({ page }) => {
    const steps = new LoginSteps(page);

    await test.step('Open login page', async () => {
      await steps.openLogin();
    });

    await test.step('Submit invalid credentials', async () => {
      await steps.submitCredentials(TestUsers.valid.email, TestUsers.invalidPassword.password);
    });

    await test.step('Verify login error', async () => {
      await steps.expectLoginError();
    });
  });

  test('@TmsLink:C1003 empty fields show validation messages', async ({ page }) => {
    const steps = new LoginSteps(page);

    await test.step('Open login page', async () => {
      await steps.openLogin();
    });

    await test.step('Submit empty login form', async () => {
      await steps.submitEmptyForm();
    });

    await test.step('Verify validation messages', async () => {
      await steps.expectValidationMessages();
    });
  });
});
