import { readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Browser, Page } from 'playwright';
import { launch } from '../src/launch';
import { saveConsoleLogs } from '../src/saveConsoleLogs';

describe('saveConsoleLogs', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
  });

  afterAll(() => browser.close());

  it('saves console logs to specified file', async () => {
    const savePath = join(tmpdir(), `${Date.now()}.mp4`);

    await saveConsoleLogs(page, savePath);

    await page.evaluate(() => console.log('hello'));
    await page.evaluate(() => console.error('demogorgon'));

    const lines = readFileSync(savePath, 'utf8').split('\n');

    expect(lines).toEqual(['log: hello', 'error: demogorgon', '']);
  });
});