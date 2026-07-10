// pages/ServicesPage.js
// Page Object for services.html.
//
// Key elements confirmed from source:
//   - <div class="services-section"> containing an <h2> and a <ul> of services
//   - 7 service items, each a <li> with a <strong> heading
//   - No form, no floating WhatsApp button on this page

export class ServicesPage {
  constructor(page) {
    this.page = page;

    // ── Services section ──────────────────────────────────────────────────────
    this.section     = page.locator('.services-section');
    this.heading     = page.locator('.services-section h2');
    this.intro       = page.locator('.services-section > p');

    // Individual service items — located by the <strong> label text
    // These match the exact strings in the source HTML
    this.rafClaims       = page.getByText('Road Accident Fund (RAF) Claims:', { exact: false });
    this.deceasedEstates = page.getByText('Deceased Estates & Property Law:', { exact: false });
    this.immigration     = page.getByText('Immigration & Refugee Law:', { exact: false });
    this.litigation      = page.getByText('Civil & Criminal Litigation:', { exact: false });
    this.familyLaw       = page.getByText('Family Law:', { exact: false });
    this.commercialLaw   = page.getByText('Commercial & Corporate Law:', { exact: false });
    this.labourLaw       = page.getByText('Labour Law:', { exact: false });

    // All <li> items — useful for counting and iterating
    this.allServiceItems = page.locator('.services-section ul li');

    // ── Footer ────────────────────────────────────────────────────────────────
    this.footer = page.locator('footer');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(baseURL) {
    await this.page.goto(baseURL + '/services');
  }
}
