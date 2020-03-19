import { Browser, Page } from 'playwright';
import { launch, openScreenshot } from '../../src';

describe('openScreenshot', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
    await page.setContent('<html>im in a screenshot</html>');
  });

  afterAll(() => browser.close());

  it('opens a screenshot', async () => {
    const process = await openScreenshot(page);
    expect(!!process).toBeTruthy();
    process.kill();
  });
});
