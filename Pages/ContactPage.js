// pages/ContactPage.js
// Page Object for contact.html.
//
// Key elements confirmed from source:
//   - Static contact details (email, phone, address)
//   - Google Maps <iframe>
//   - <form id="contactForm"> with fields: #name, #email, #message
//   - <button id="submitBtn">Send Message</button>
//   - <div id="formFeedback" class="form-feedback"> for JS feedback messages
//   - JS-side validation: trims whitespace, blocks < and > chars
//   - On success: POSTs to Make.com webhook, resets form
//   - <a class="whatsapp-btn" id="waButton"> floating button (same as homepage)

export class ContactPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Static contact info ───────────────────────────────────────────────────
    // These are plain <p> tags — identified by their text content
    this.emailInfo   = page.getByText('Email: admin@bmalulekaattorneys.co.za');
    this.phoneInfo   = page.getByText('Phone: 084 849 5714');
    this.addressInfo = page.getByText('Address: 391 Anton Lembede Street, Durban, South Africa');

    // ── Google Maps embed ─────────────────────────────────────────────────────
    this.mapIframe   = page.locator('.map-container iframe');

    // ── Contact form ──────────────────────────────────────────────────────────
    this.form        = page.locator('#contactForm');

    // Use getByLabel for semantic, accessible locators where a <label> exists.
    // Source confirms: <label for="name">, <label for="email">, <label for="message">
    this.nameInput    = page.getByLabel('Full Name:');
    this.emailInput   = page.getByLabel('Email:');
    this.messageInput = page.getByLabel('Message / Contact Details:');

    // Submit button — ID confirmed in source
    this.submitBtn    = page.locator('#submitBtn');

    // Feedback div — populated by JS after submission attempt
    this.feedback     = page.locator('#formFeedback');

    // ── WhatsApp floating button ───────────────────────────────────────────────
    // Identical markup to index.html — same class and id
    this.whatsAppBtn  = page.locator('a.whatsapp-btn#waButton');
    this.whatsAppText = page.locator('a.whatsapp-btn#waButton .wa-text');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(baseURL) {
    await this.page.goto(baseURL + '/contact.html');
  }

  // ── Form helpers ──────────────────────────────────────────────────────────

  /**
   * Fills the contact form with provided data.
   * Any field left undefined is skipped (useful for partial-fill tests).
   *
   * @param {{ name?: string, email?: string, message?: string }} data
   */
  async fillForm({ name, email, message } = {}) {
    if (name    !== undefined) await this.nameInput.fill(name);
    if (email   !== undefined) await this.emailInput.fill(email);
    if (message !== undefined) await this.messageInput.fill(message);
  }

  /** Clicks the submit button. */
  async submit() {
    await this.submitBtn.click();
  }

  /**
   * Fills all fields with valid data and submits the form.
   * Waits for the feedback div to become visible before returning.
   *
   * @param {{ name: string, email: string, message: string }} data
   */
  async fillAndSubmit(data) {
    await this.fillForm(data);
    await this.submit();
    // Wait for JS feedback to appear
    await this.feedback.waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Returns the current text content of the feedback message div.
   * @returns {Promise<string>}
   */
  async getFeedbackText() {
    return this.feedback.innerText();
  }

  /**
   * Returns true if the feedback div has the 'success' CSS class.
   * The JS handler adds either 'success' or 'error' to the class list.
   */
  async isFeedbackSuccess() {
    return this.feedback.evaluate(el => el.classList.contains('success'));
  }

  async isFeedbackError() {
    return this.feedback.evaluate(el => el.classList.contains('error'));
  }
}
