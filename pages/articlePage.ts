import { Page, Locator } from "@playwright/test";

export class ArticlePage {
  readonly page: Page;
  //Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  //tabs
  readonly firstHeading: Locator;
  readonly editLink: Locator;
  readonly viewHistoryLink: Locator;
  readonly readLink: Locator;
  readonly helpLink: Locator;
  // language
  readonly languageButton: Locator;
  readonly languageSearchInput: Locator;

  // Edit Modal
  readonly editModal: Locator;
  readonly startEditingButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Search
    this.searchInput = page.locator("#searchInput");
    this.searchButton = page.locator("#searchform button");

    //tabs
    this.firstHeading = page.locator("#firstHeading");
    this.editLink = page.locator("#ca-edit a");
    this.viewHistoryLink = page.locator("#ca-history a");
    this.readLink = page.locator("#ca-view a");
    this.helpLink = page.locator("#mw-indicator-mw-helplink a");

    //language
    this.languageButton = page.locator("#p-lang-btn");
    this.languageSearchInput = page.locator("input.uls-languagefilter");

    // Edit Modal
    this.editModal = page.locator("//label[@id='ooui-7']");
    this.startEditingButton = page
      .locator(".oo-ui-actionWidget.oo-ui-flaggedElement-primary")
      .getByRole("button");
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async selectLanguage(targetLanguage: string) {
    await this.languageButton.click();
    await this.languageSearchInput.waitFor({ state: "visible" });
    await this.languageSearchInput.fill(targetLanguage);
    const languageLink = this.page.getByRole("link", {
      name: targetLanguage,
      exact: true,
    });
    await languageLink.waitFor({ state: "visible" });
    await languageLink.click();
    await this.page.waitForLoadState("networkidle");
  }
}
