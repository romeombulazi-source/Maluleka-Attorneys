// pages/HeaderPage.js
// Shared header & navigation POM.
// The site uses a CSS checkbox-toggle hamburger menu — there is no
// <button> for the nav toggle, just a <label for="menu-toggle">.
// All four pages share identical header markup, so this class is
// imported by every other Page Object.

export class HeaderPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Brand / Logo ───────────────────────────────────────────────────────────
    // The logo is an <img> inside a .logo div alongside text
    this.logoImage   = page.locator('header .logo img.logo-img');
    this.logoText    = page.locator('header .logo');

    // ── Hamburger toggle (mobile) ──────────────────────────────────────────────
    // The actual <input type="checkbox"> is hidden; the visible control is
    // the <label for="menu-toggle">. Click the label to open/close the menu.
    this.menuToggle  = page.locator('label[for="menu-toggle"]');
    this.menuCheckbox = page.locator('#menu-toggle');

    // ── Navigation links ───────────────────────────────────────────────────────
    this.nav         = page.locator('header nav');
    this.navHome     = page.locator('header nav a[href="index.html"]');
    this.navServices = page.locator('header nav a[href="services.html"]');
    this.navAbout    = page.locator('header nav a[href="about.html"]');
    this.navContact  = page.locator('header nav a[href="contact.html"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Opens the hamburger menu on mobile viewports by clicking the label. */
  async openMobileMenu() {
    await this.menuToggle.click();
  }

  /** Returns true if the checkbox toggle is checked (menu open). */
  async isMenuOpen() {
    return this.menuCheckbox.isChecked();
  }

  async clickHome()     { await this.navHome.click(); }
  async clickServices() { await this.navServices.click(); }
  async clickAbout()    { await this.navAbout.click(); }
  async clickContact()  { await this.navContact.click(); }
}
