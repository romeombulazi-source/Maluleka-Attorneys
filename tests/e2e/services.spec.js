// tests/services.spec.js
// Test suite: Services page (services.html)
// Covers: heading, intro paragraph, all 7 service items.

import { test, expect } from '@playwright/test';
import { ServicesPage } from '../pages/ServicesPage.js';

test.describe('Services page – content', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const services = new ServicesPage(page);
    await services.goto(baseURL);
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle('B Maluleka Attorneys Inc - Services');
  });

  test('services heading is visible', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.heading).toBeVisible();
    await expect(services.heading).toHaveText('Our Legal Services');
  });

  test('intro paragraph is present', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.intro).toBeVisible();
  });

  test('exactly 7 service items are listed', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.allServiceItems).toHaveCount(7);
  });

  test('RAF Claims service item is present', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.rafClaims).toBeVisible();
  });

  test('Deceased Estates & Property Law item is present', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.deceasedEstates).toBeVisible();
  });

  test('Immigration & Refugee Law item is present', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.immigration).toBeVisible();
  });

  test('Civil & Criminal Litigation item is present', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.litigation).toBeVisible();
  });

  test('Family Law item is present', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.familyLaw).toBeVisible();
  });

  test('Commercial & Corporate Law item is present', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.commercialLaw).toBeVisible();
  });

  test('Labour Law item is present', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.labourLaw).toBeVisible();
  });

  test('footer contains copyright text', async ({ page }) => {
    const services = new ServicesPage(page);
    await expect(services.footer).toContainText('© 2025 B Maluleka Attorneys Inc');
  });

});
