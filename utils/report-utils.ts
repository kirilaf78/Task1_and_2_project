import { Page, TestInfo } from "@playwright/test";

/**
 * Takes screenshot and attaches to report
 * @param testInfo - info object
 * @param name - screenshot name in the report
 * @param page - Playwright page
 */
export async function attachScreenshot(
  testInfo: TestInfo,
  name: string,
  page: Page
) {
  const screenshotBuffer = await page.screenshot();

  await testInfo.attach(name, {
    body: screenshotBuffer,
    contentType: "image/png",
  });
}
