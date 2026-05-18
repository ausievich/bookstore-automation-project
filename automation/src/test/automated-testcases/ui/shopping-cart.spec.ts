/**
 * Domain: Online Bookstore
 * Feature: Shopping Cart
 * Owner: bookstore-qa
 */
import { test, expect } from '@automation/test/test-base/fixtures';
import { LoginSteps } from '@automation/main/ui/steps/login.steps';
import { CatalogSteps } from '@automation/main/ui/steps/catalog.steps';
import { CartSteps } from '@automation/main/ui/steps/cart.steps';
import { TestUsers } from '@automation/main/common/constants/credentials';
import { allure } from 'allure-playwright';
import { Owner } from '@automation/main/common/annotations';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await allure.owner(Owner.Bookstore);
    const login = new LoginSteps(page);
    await login.loginAsValidUser(TestUsers.valid.email, TestUsers.valid.password);
  });

  test('@TmsLink:C3001 add book updates cart counter', async ({ page }) => {
    const catalog = new CatalogSteps(page);
    await catalog.addBook('b1');
    await catalog.refreshCartCounter();
    await catalog.expectCartCount(1);
  });

  test('@TmsLink:C3002 multiple books in cart', async ({ page }) => {
    const catalog = new CatalogSteps(page);
    await catalog.addBook('b1');
    await catalog.addBook('b3');
    const cart = new CartSteps(page);
    await cart.openCart();
    await cart.expectItemCount(2);
  });

  test('@TmsLink:C3003 remove book from cart', async ({ page }) => {
    const catalog = new CatalogSteps(page);
    await catalog.addBook('b1');
    const cart = new CartSteps(page);
    await cart.openCart();
    await cart.removeItem('b1');
    await cart.expectEmptyCart();
  });

  test('@TmsLink:C3004 update quantity recalculates subtotal', async ({ page }) => {
    const catalog = new CatalogSteps(page);
    await catalog.addBook('b4');
    const cart = new CartSteps(page);
    await cart.openCart();
    await cart.updateQuantity('b4', 2);
    await cart.expectSubtotalContains('44.00');
  });

  test('@TmsLink:C3005 empty cart message', async ({ page }) => {
    const cart = new CartSteps(page);
    await cart.openCart();
    await cart.expectEmptyCart();
  });
});
