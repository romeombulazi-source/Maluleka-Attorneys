// tests/about.spec.js
// Test suite: About page (about.html)
// Covers: director name, title, areas of expertise, bio content.

import { test, expect } from '@playwright/test';
import { AboutPage } from '../pages/AboutPage.js';

test.describe('About page – bio content', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const about = new AboutPage(page);
    await about.goto(baseURL);
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle('B Maluleka Attorneys Inc - About Us');
  });

  test('director name heading is visible', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.directorName).toBeVisible();
    await expect(about.directorName).toHaveText('Bhekithemba Maluleka');
  });

  test('director title is correct', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.directorTitle).toBeVisible();
    await expect(about.directorTitle).toHaveText('Founder & Director, BM Attorneys Inc.');
  });

  test('"Areas of Expertise" subheading is present', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.expertiseHeading).toBeVisible();
  });

  test('"Our Approach" subheading is present', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.approachHeading).toBeVisible();
  });

  test('exactly 3 expertise items are listed', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.expertiseItems).toHaveCount(3);
  });

  test('Property & Estates expertise area is listed', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.expertiseProperty).toBeVisible();
  });

  test('Immigration & Refugee Law expertise area is listed', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.expertiseImmigration).toBeVisible();
  });

  test('Litigation & Advisory expertise area is listed', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.expertiseLitigation).toBeVisible();
  });

  test('bio section mentions University of KwaZulu-Natal', async ({ page }) => {
    const about = new AboutPage(page);
    // Confirms the LLB credential text is present in the bio
    await expect(about.section).toContainText('University of KwaZulu-Natal');
  });

  test('footer contains copyright text', async ({ page }) => {
    const about = new AboutPage(page);
    await expect(about.footer).toContainText('© 2025 B Maluleka Attorneys Inc');
  });

});
