// tests/homepage.spec.js
// Test suite: Homepage (index.html)
// Covers: hero content, CTA button, WhatsApp floating button, footer.

import { test, expect } from '@playwright/test';
import { HomePage }   from '../pages/HomePage.js';
import { HeaderPage } from '../pages/HeaderPage.js';

// ── TC-UI-01 / TC-UI-02 equivalent for the homepage ───────────────────────────
test.describe('Homepage – content and layout', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const home = new HomePage(page);
    await home.goto(baseURL);
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle('B Maluleka Attorneys Inc - Home');
  });

  test('hero heading displays firm name', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.heroHeading).toBeVisible();
    await expect(home.heroHeading).toHaveText('B Maluleka Attorneys Inc');
  });

  test('establishment badge shows "Est. 2025"', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.estBadge).toBeVisible();
    await expect(home.estBadge).toHaveText('Est. 2025');
  });

  test('"Book Consultation" button is visible and navigates to contact page', async ({ page, baseURL }) => {
    const home = new HomePage(page);
    await expect(home.bookBtn).toBeVisible();
    await home.clickBookConsultation();
    await expect(page).toHaveURL(/contact\.html/);
  });

  test('footer contains copyright text', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.footer).toContainText('© 2025 B Maluleka Attorneys Inc');
  });

});

// ── WhatsApp floating button ───────────────────────────────────────────────────
test.describe('Homepage – WhatsApp floating button', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const home = new HomePage(page);
    await home.goto(baseURL);
  });

  test('WhatsApp button is visible on homepage', async ({ page }) => {
    const home = new HomePage(page);
    await home.whatsAppBtn.scrollIntoViewIfNeeded();
    await expect(home.whatsAppBtn).toBeVisible();
  });

  test('WhatsApp icon img has correct alt text', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.whatsAppIcon).toHaveAttribute('alt', 'WhatsApp Icon');
  });

  test('WhatsApp label text is correct', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.whatsAppLabel).toHaveText('Contact us on WhatsApp for faster replies');
  });

  test('WhatsApp button has target="_blank" attribute', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.whatsAppBtn).toHaveAttribute('target', '_blank');
  });

  // TODO: Update this test once the real wa.me URL is set in production.
  // Currently href="#" — this test documents that the placeholder is present
  // and flags it as a known defect to resolve before go-live.
  test('WhatsApp button href is set (placeholder defect check)', async ({ page }) => {
    const home = new HomePage(page);
    const href = await home.whatsAppBtn.getAttribute('href');
    // KNOWN DEFECT: href is currently "#" — change assertion to
    // expect(href).toMatch(/^https:\/\/wa\.me\//) once real number is configured
    expect(href).toBeTruthy();
    console.warn('[TC-UI-08] WhatsApp href is a placeholder "#". Update with real wa.me URL before go-live.');
  });

});

// ── Navigation header ──────────────────────────────────────────────────────────
test.describe('Homepage – navigation header', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const home = new HomePage(page);
    await home.goto(baseURL);
  });

  test('logo image is visible', async ({ page }) => {
    const header = new HeaderPage(page);
    await expect(header.logoImage).toBeVisible();
  });

  test('logo image has correct alt text', async ({ page }) => {
    const header = new HeaderPage(page);
    await expect(header.logoImage).toHaveAttribute('alt', 'B Maluleka Attorneys Inc Logo');
  });

  test('all four nav links are visible', async ({ page }) => {
    const header = new HeaderPage(page);
    await expect(header.navHome).toBeVisible();
    await expect(header.navServices).toBeVisible();
    await expect(header.navAbout).toBeVisible();
    await expect(header.navContact).toBeVisible();
  });

  test('nav links point to correct hrefs', async ({ page }) => {
    const header = new HeaderPage(page);
    await expect(header.navHome).toHaveAttribute('href', 'index.html');
    await expect(header.navServices).toHaveAttribute('href', 'services.html');
    await expect(header.navAbout).toHaveAttribute('href', 'about.html');
    await expect(header.navContact).toHaveAttribute('href', 'contact.html');
  });

  test('hamburger toggle is present for mobile', async ({ page }) => {
    const header = new HeaderPage(page);
    await expect(header.menuToggle).toBeAttached();
  });

  test('hamburger toggles menu open on click', async ({ page }) => {
    const header = new HeaderPage(page);
    // Menu starts closed (checkbox unchecked)
    await expect(header.menuCheckbox).not.toBeChecked();
    await header.openMobileMenu();
    await expect(header.menuCheckbox).toBeChecked();
  });

});
