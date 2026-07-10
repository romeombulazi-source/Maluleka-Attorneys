// pages/HomePage.js
// Page Object for the Homepage.

export class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Hero section ──────────────────────────────────────────────────────────
    this.hero             = page.locator('section.hero');
    this.heroHeading      = page.locator('section.hero h1');
    this.estBadge         = page.locator('section.hero .est');

    // ── CTA ───────────────────────────────────────────────────────────────────
    this.ctaText          = page.locator('.cta-section .cta-text');
    
    // Updated: Using a partial attribute match '*=' allows it to find '/contact', 
    // 'contact', or 'contact.html' if needed, making it more resilient.
    this.bookBtn          = page.locator('a.consult-btn[href*="contact"]');

    // ── WhatsApp floating button ───────────────────────────────────────────────
    this.whatsAppBtn      = page.locator('a.whatsapp-btn#waButton');
    this.whatsAppIcon     = page.locator('a.whatsapp-btn#waButton img[alt="WhatsApp Icon"]');
    this.whatsAppLabel    = page.locator('a.whatsapp-btn#waButton .wa-text');

    // ── Footer ────────────────────────────────────────────────────────────────
    this.footer           = page.locator('footer');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Navigates to the homepage.
   * Using '/' is cleaner for Netlify's clean routing.
   */
  async goto() {
    await this.page.goto('/');
  }

  /** Clicks the "Book Consultation" CTA and waits for navigation to clean /contact URL */
  async clickBookConsultation() {
    await this.bookBtn.click();
    // Updated: Waiting for '**/contact' handles Netlify's extensionless URLs
    await this.page.waitForURL('/contact');
  }

  /**
   * Clicks the WhatsApp button and returns the new tab that opens.
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
