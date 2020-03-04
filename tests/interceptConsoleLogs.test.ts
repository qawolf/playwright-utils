import { Browser, Page } from 'playwright';
import { launch } from '../src/launch';
import { interceptConsoleLogs } from '../src/interceptConsoleLogs';

describe('interceptConsoleLogs', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await launch();
  });

  afterAll(() => browser.close());

  it('calls callback on console log', async () => {
    page = await browser.newPage();

    const callback = jest.fn();

    await interceptConsoleLogs({
      callback,
      page,
    });

    await page.evaluate(() => console.log('hello'));

    expect(callback).toBeCalledWith('log', 'hello');

    await page.close();
  });
});
