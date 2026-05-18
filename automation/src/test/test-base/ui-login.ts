import { Page, test } from '@playwright/test';
import { LoginSteps } from '@automation/main/ui/steps/login.steps';
import { TestUsers } from '@automation/main/common/constants/credentials';

export async function loginAsBookstoreUser(page: Page): Promise<void> {
  const login = new LoginSteps(page);
  await test.step('Open login page', async () => {
    await login.openLogin();
  });
  await test.step('Submit valid credentials', async () => {
    await login.submitCredentials(TestUsers.valid.email, TestUsers.valid.password);
  });
  await test.step('Wait for catalog redirect', async () => {
    await login.waitForCatalogRedirect();
  });
}
