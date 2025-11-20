
import { test as base } from "../utils/test-options";
import { ArticlePage } from "../pages/articlePage";
import { HelpPage } from "../pages/helpPage";

type PageFixtures = {
  articlePage: ArticlePage;
  helpPage: HelpPage;
};

export const test = base.extend<PageFixtures>({
  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },
  helpPage: async ({ page }, use) => {
    await use(new HelpPage(page));
  },
});

export { expect } from "@playwright/test";
