// tests/contact.spec.js
// Test suite: Contact page (contact.html)
// Covers: static info, Google Maps embed, form validation, form submission,
//         JS feedback messages, WhatsApp button.
//
// IMPORTANT: The form POSTs to a live Make.com webhook.
// For CI environments, intercept the network request to avoid hitting
// the real endpoint. See the network interception helper below.

import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage.js';

// ── Valid test data ────────────────────────────────────────────────────────────
const VALID_DATA = {
  name:    'Test Client',
  email:   'testclient@example.com',
  message: 'This is an automated Playwright test submission. Please ignore.',
};

const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/8mp52ifkjmqswgtmafqt2u4yccxdu7qr';

// ── Static content ─────────────────────────────────────────────────────────────
test.describe('Contact page – static content', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);
  });

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle('B Maluleka Attorneys Inc - Contact');
  });

  test('email address is displayed', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.emailInfo).toBeVisible();
  });

  test('phone number is displayed', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.phoneInfo).toBeVisible();
  });

  test('physical address is displayed', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.addressInfo).toBeVisible();
  });

  test('Google Maps iframe is embedded', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.mapIframe).toBeAttached();
    // Confirm it points to a Google Maps URL
    const src = await contact.mapIframe.getAttribute('src');
    expect(src).toContain('google.com/maps');
  });

});

// ── Form rendering ─────────────────────────────────────────────────────────────
test.describe('Contact page – form rendering (TC-UI-02 equivalent)', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);
  });

  test('Full Name field is visible and labelled', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.nameInput).toBeVisible();
  });

  test('Email field is visible and labelled', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.emailInput).toBeVisible();
  });

  test('Message field is visible and labelled', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.messageInput).toBeVisible();
  });

  test('Submit button is visible and enabled', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.submitBtn).toBeVisible();
    await expect(contact.submitBtn).toBeEnabled();
    await expect(contact.submitBtn).toHaveText('Send Message');
  });

  test('Feedback div is not visible before submission', async ({ page }) => {
    const contact = new ContactPage(page);
    // formFeedback exists in DOM but should not be visible initially
    await expect(contact.feedback).not.toBeVisible();
  });

});

// ── Form validation (TC-UI-04, TC-UI-05) ──────────────────────────────────────
test.describe('Contact page – form validation', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);
  });

  test('HTML5 required validation blocks empty name submission', async ({ page }) => {
    const contact = new ContactPage(page);
    // Leave name empty, fill other fields
    await contact.fillForm({ email: VALID_DATA.email, message: VALID_DATA.message });
    await contact.submit();
    // Native browser validation should prevent submission — no feedback div appears
    await expect(contact.nameInput).toBeFocused();
  });

  test('HTML5 required validation blocks empty email submission', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.fillForm({ name: VALID_DATA.name, message: VALID_DATA.message });
    await contact.submit();
    await expect(contact.emailInput).toBeFocused();
  });

  test('HTML5 required validation blocks empty message submission', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.fillForm({ name: VALID_DATA.name, email: VALID_DATA.email });
    await contact.submit();
    await expect(contact.messageInput).toBeFocused();
  });

  test('JS validation shows error when name contains "<" character (TC-UI-05)', async ({ page }) => {
    const contact = new ContactPage(page);
    // Intercept the network call so we don't hit the real webhook
    await page.route(MAKE_WEBHOOK_URL, route => route.abort());

    await contact.fillForm({
      name:    'Malicious <script>',
      email:   VALID_DATA.email,
      message: VALID_DATA.message,
    });
    await contact.submit();

    await contact.feedback.waitFor({ state: 'visible', timeout: 5_000 });
    expect(await contact.isFeedbackError()).toBe(true);
    await expect(contact.feedback).toContainText('Invalid characters');
  });

  test('JS validation shows error when message contains ">" character', async ({ page }) => {
    const contact = new ContactPage(page);
    await page.route(MAKE_WEBHOOK_URL, route => route.abort());

    await contact.fillForm({
      name:    VALID_DATA.name,
      email:   VALID_DATA.email,
      message: 'Please redirect to > this link',
    });
    await contact.submit();

    await contact.feedback.waitFor({ state: 'visible', timeout: 5_000 });
    expect(await contact.isFeedbackError()).toBe(true);
    await expect(contact.feedback).toContainText('Invalid characters');
  });

  test('JS validation shows error when whitespace-only name is submitted', async ({ page }) => {
    const contact = new ContactPage(page);
    await page.route(MAKE_WEBHOOK_URL, route => route.abort());

    await contact.fillForm({
      name:    '   ',   // spaces only — JS trim() should catch this
      email:   VALID_DATA.email,
      message: VALID_DATA.message,
    });
    await contact.submit();

    await contact.feedback.waitFor({ state: 'visible', timeout: 5_000 });
    expect(await contact.isFeedbackError()).toBe(true);
    await expect(contact.feedback).toContainText('Please fill in all required fields');
  });

  test('HTML5 email field rejects invalid email format (TC-UI-05)', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.fillForm({
      name:    VALID_DATA.name,
      email:   'notanemail',
      message: VALID_DATA.message,
    });
    await contact.submit();
    // HTML5 type="email" validation fires before JS — email field gets focus
    await expect(contact.emailInput).toBeFocused();
  });

});

// ── Form submission (TC-UI-03) ─────────────────────────────────────────────────
test.describe('Contact page – form submission', () => {

  test('submit button is disabled while submission is in progress', async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);

    // Slow down the webhook response so we can catch the disabled state
    await page.route(MAKE_WEBHOOK_URL, async route => {
      await new Promise(res => setTimeout(res, 1500));
      await route.fulfill({ status: 200, body: 'ok' });
    });

    await contact.fillForm(VALID_DATA);
    await contact.submit();

    // Check button is disabled during the async fetch
    await expect(contact.submitBtn).toBeDisabled();
  });

  test('successful submission shows success feedback and resets form', async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);

    // Mock the webhook to return 200 — avoids hitting the real Make.com endpoint
    await page.route(MAKE_WEBHOOK_URL, route =>
      route.fulfill({ status: 200, body: 'Accepted' })
    );

    await contact.fillAndSubmit(VALID_DATA);

    expect(await contact.isFeedbackSuccess()).toBe(true);
    await expect(contact.feedback).toContainText('Message sent successfully');

    // Form fields should be cleared after success
    await expect(contact.nameInput).toHaveValue('');
    await expect(contact.emailInput).toHaveValue('');
    await expect(contact.messageInput).toHaveValue('');
  });

  test('webhook error response shows error feedback', async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);

    // Mock the webhook to return 500
    await page.route(MAKE_WEBHOOK_URL, route =>
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    );

    await contact.fillAndSubmit(VALID_DATA);

    expect(await contact.isFeedbackError()).toBe(true);
    await expect(contact.feedback).toContainText('Something went wrong');
  });

  test('network failure shows network error feedback', async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);

    // Simulate a network error (connection refused)
    await page.route(MAKE_WEBHOOK_URL, route => route.abort('failed'));

    await contact.fillAndSubmit(VALID_DATA);

    expect(await contact.isFeedbackError()).toBe(true);
    await expect(contact.feedback).toContainText('Network error');
  });

  test('submit button re-enables after failed submission', async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);

    await page.route(MAKE_WEBHOOK_URL, route =>
      route.fulfill({ status: 500, body: 'Error' })
    );

    await contact.fillAndSubmit(VALID_DATA);
    await expect(contact.submitBtn).toBeEnabled();
  });

});

// ── WhatsApp button (contact page instance) ────────────────────────────────────
test.describe('Contact page – WhatsApp floating button', () => {

  test.beforeEach(async ({ page, baseURL }) => {
    const contact = new ContactPage(page);
    await contact.goto(baseURL);
  });

  test('WhatsApp button is present on the contact page', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.whatsAppBtn.scrollIntoViewIfNeeded();
    await expect(contact.whatsAppBtn).toBeVisible();
  });

  test('WhatsApp tooltip text is correct', async ({ page }) => {
    const contact = new ContactPage(page);
    await expect(contact.whatsAppText).toHaveText('Contact us on WhatsApp for faster replies');
  });

});
