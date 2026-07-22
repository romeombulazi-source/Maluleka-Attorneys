// tests/navigation.spec.js
// Test suite: Cross-page navigation
// Verifies that the shared nav header correctly routes between all 4 pages.
// This suite also validates the hamburger menu toggle on a mobile viewport.

import { test, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage.js';
import { HomePage }   from '../pages/HomePage.js';

test.describe('Navigation – desktop routing', () => {

  // Start each test on the homepage
  test.beforeEach(async ({ page, baseURL }) => {
    const home = new HomePage(page);
    await home.goto(baseURL);
  });

  test('clicking Services nav link routes to services', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.clickServices();
    await expect(page).toHaveURL(/.*\/services/);
    await expect(page).toHaveTitle('B Maluleka Attorneys Inc - Services');
  });

  test('clicking About Us nav link routes to about', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.clickAbout();
    await expect(page).toHaveURL(/.*\/about/);
    await expect(page).toHaveTitle('B Maluleka Attorneys Inc - About Us');
  });

  test('clicking Contact nav link routes to contact', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.clickContact();
    await expect(page).toHaveURL(/.*\/contact/);
    await expect(page).toHaveTitle('B Maluleka Attorneys Inc - Contact');
  });

  test('clicking Home nav link from another page returns to index', async ({ page, baseURL }) => {
    // Navigate away first
    await page.goto(baseURL + '/services');
    const header = new HeaderPage(page);
    await header.clickHome();
    await expect(page).toHaveURL(/.*\/$/);
    await expect(page).toHaveTitle('B Maluleka Attorneys Inc - Home');
  });

});

// ── Mobile hamburger menu ──────────────────────────────────────────────────────
test.describe('Navigation – mobile hamburger menu', () => {

  // Use Playwright's built-in mobile device emulation
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14 dimensions

  test.beforeEach(async ({ page, baseURL }) => {
    const home = new HomePage(page);
    await home.goto(baseURL);
  });

  test('hamburger checkbox is unchecked by default on mobile', async ({ page }) => {
    const header = new HeaderPage(page);
    await expect(header.menuCheckbox).not.toBeChecked();
  });

  test('clicking hamburger label checks the menu-toggle checkbox', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.openMobileMenu();
    await expect(header.menuCheckbox).toBeChecked();
  });

  test('clicking hamburger again unchecks the toggle (closes menu)', async ({ page }) => {
    const header = new HeaderPage(page);
    await header.openMobileMenu();                    // open
    await expect(header.menuCheckbox).toBeChecked();
    await header.openMobileMenu();                    // close
    await expect(header.menuCheckbox).not.toBeChecked();
  });

});
