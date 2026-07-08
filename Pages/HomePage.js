// pages/HomePage.js
// Page Object for index.html (Homepage).
//
// Key elements confirmed from source:
//   - .hero section with background image
//   - <h1>B Maluleka Attorneys Inc</h1>
//   - .est div containing "Est. 2025"
//   - <a href="contact.html" class="consult-btn">Book Consultation</a>
//   - <a href="#" class="whatsapp-btn"> floating button (NOT a <button> element)

export class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Hero section ──────────────────────────────────────────────────────────
    this.hero           = page.locator('section.hero');
    this.heroHeading    = page.locator('section.hero h1');
    this.estBadge       = page.locator('section.hero .est');

    // ── CTA ───────────────────────────────────────────────────────────────────
    // Scoped to .hero so it doesn't conflict with any other page CTAs
    this.ctaText        = page.locator('.cta-section .cta-text');
    this.bookBtn        = page.locator('a.consult-btn[href="contact.html"]');

    // ── WhatsApp floating button ───────────────────────────────────────────────
    // Source: <a href="#" class="whatsapp-btn" target="_blank" id="waButton">
    // NOTE: href is "#" (placeholder). In production this should be a real
    // wa.me URL. The test asserts the element is present; the URL test is
    // in a separate suite (footer-whatsapp.spec.js) once the real URL is set.
    this.whatsAppBtn    = page.locator('a.whatsapp-btn#waButton');
    this.whatsAppIcon   = page.locator('a.whatsapp-btn#waButton img[alt="WhatsApp Icon"]');
    this.whatsAppLabel  = page.locator('a.whatsapp-btn#waButton .wa-text');

    // ── Footer ────────────────────────────────────────────────────────────────
    this.footer         = page.locator('footer');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Navigates to the homepage.
   * baseURL is injected from playwright.config.js
   */
  async goto(baseURL) {
    await this.page.goto(baseURL + '/index.html');
  }

  /** Clicks the "Book Consultation" CTA and waits for navigation to contact.html */
  async clickBookConsultation() {
    await this.bookBtn.click();
    await this.page.waitForURL('**/contact.html');
  }

  /**
   * Clicks the WhatsApp button and returns the new tab that opens.
   * Note: currently href="#" so no new tab will open until a real wa.me
   * URL is set. This method is future-proofed for when that is done.
   *
   * @returns {Promise<import('@playwright/test').Page>} New tab page object
   */
  async clickWhatsAppAndGetNewTab() {
    const [newTab] = await Promise.all([
      this.page.context().waitForEvent('popup'),
      this.whatsAppBtn.click(),
    ]);
    await newTab.waitForLoadState('domcontentloaded');
    return newTab;
  }
}
