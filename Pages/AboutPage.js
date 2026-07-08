// pages/AboutPage.js
// Page Object for about.html.
//
// Key elements confirmed from source:
//   - <div class="bio-section"> containing director bio
//   - <h2>Bhekithemba Maluleka</h2>
//   - <h3>Founder & Director, BM Attorneys Inc.</h3>
//   - Two <h4> subheadings: "Areas of Expertise" and "Our Approach"
//   - <ul> with 3 expertise areas, each with a <strong> label
//   - No form, no WhatsApp button on this page

export class AboutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Bio section ───────────────────────────────────────────────────────────
    this.section        = page.locator('.bio-section');
    this.directorName   = page.locator('.bio-section h2');
    this.directorTitle  = page.locator('.bio-section h3');

    // Subheadings
    this.expertiseHeading = page.getByRole('heading', { name: 'Areas of Expertise', exact: true });
    this.approachHeading  = page.getByRole('heading', { name: 'Our Approach', exact: true });

    // Expertise list items — matched by their <strong> label text
    this.expertiseProperty   = page.getByText('Property & Estates:', { exact: false });
    this.expertiseImmigration = page.getByText('Immigration & Refugee Law:', { exact: false });
    this.expertiseLitigation  = page.getByText('Litigation & Advisory:', { exact: false });

    // All expertise <li> items
    this.expertiseItems = page.locator('.bio-section ul li');

    // ── Footer ────────────────────────────────────────────────────────────────
    this.footer = page.locator('footer');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(baseURL) {
    await this.page.goto(baseURL + '/about.html');
  }
}
