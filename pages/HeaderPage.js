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

 // pages/HeaderPage.js

// ── Navigation links ───────────────────────────────────────────────────────
this.nav         = page.locator('header nav');

// Use getByRole to find links by their visible text. 
// This completely ignores the href attribute, making it immune to URL changes!
this.navHome     = page.getByRole('link', { name: 'Home' });
this.navServices = page.getByRole('link', { name: 'Services' });
this.navAbout    = page.getByRole('link', { name: 'About Us' });
 this.navContact = this.nav.getByRole('link', { name: 'Contact' });}

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
/**
   * Ensures the navigation links are visible. 
   * Useful for responsive testing where the hamburger menu might hide them.
   */
 /**
   * Ensures the navigation links are visible. 
   * Useful for responsive testing where the hamburger menu might hide them.
   */
  async ensureNavVisible() {
    // Check if the hamburger menu is visible (mobile/tablet view)
    if (await this.menuToggle.isVisible()) {
      await this.menuToggle.click();
    }
  } }
