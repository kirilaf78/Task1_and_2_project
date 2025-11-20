// Importing our custom 'test'
import { test, expect } from "../../fixures/test-options";
import { ArticlePage } from "../../pages/articlePage";
import { HelpPage } from "../../pages/helpPage";

test("Wikipedia E2E Flow", async ({
  page,
  context,
  searchQuery,
  targetLanguageSelector,
  targetLanguage,
  mainTitle,
}) => {
  const articlePage = new ArticlePage(page);

  // 1. Go to base URL and verify
  await page.goto("/");
  await expect(page).toHaveTitle(new RegExp(mainTitle));
  // 2. Search
  await articlePage.search(searchQuery);
  await expect(articlePage.firstHeading).toBeVisible();
  await expect(articlePage.firstHeading).toContainText(searchQuery);

  await page.screenshot({
    path: `screenshots/search-result-${test.info().project.name}.png`,
  });

  // 3. Click 'Edit'
  await articlePage.editLink.click();

  // 4. Verify Modal
  await expect(articlePage.editModal).toBeVisible();

  // 5. Click 'Start editing' (используем метод из POM)
  await articlePage.startEditingButton.click();

  // 6. Verify Modal is hidden
  await expect(articlePage.editModal).toBeHidden();

  // 7. Click 'View history', click 'Help'
  await articlePage.viewHistoryLink.click();

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    await articlePage.helpLink.click(),
  ]);
  await newPage.waitForLoadState("networkidle");

  const helpPage = new HelpPage(newPage);
  await helpPage.verifyHelpPageUrl();
  await newPage.close();

  // 8. Go back to 'Read' section
  await articlePage.readLink.click();

  // Open language list and select target language
  await articlePage.selectLanguage(targetLanguageSelector);

  // Verify Appropriate article opens
  await expect(articlePage.firstHeading).toBeVisible();
  // Verify page title is in Belarusian or Japanese
  await expect(articlePage.firstHeading).toContainText(targetLanguage);
  await page.screenshot({
    path: `screenshots/language-switch-${test.info().project.name}.png`,
  });
});
