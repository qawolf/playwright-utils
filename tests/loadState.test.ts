import { tmpdir } from 'os';
import { join } from 'path';
import { Browser } from 'playwright';
import { launch } from '../src/launch';
import { loadState } from '../src/loadState';
import { saveState } from '../src/saveState';
import { randomString } from './utils';

const COOKIE = {
  sameSite: 'Lax' as 'Lax',
  name: 'csrf_same_site',
  value: '1',
  domain: '.twitter.com',
  path: '/',
  expires: 1615052185.041635,
  httpOnly: true,
  secure: true,
};

describe('loadState', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await launch();
  });

  afterAll(() => browser.close());

  it('loads state from the specified file', async () => {
    const savePath = join(tmpdir(), randomString(), 'state.json');

    const page = await browser.newPage();
    await page.goto('http://example.com');

    await page.context().setCookies([COOKIE]);
    await page.evaluate(() => {
      localStorage.setItem('hello', 'world');
      sessionStorage.setItem('in', 'sessionStorage');
    });

    await saveState(page, savePath);

    const newBrowser = await launch();
    const page2 = await newBrowser.newPage();
    await page2.goto('http://example.com');

    await loadState(page2, savePath);

    const cookies = await page.context().cookies();
    expect(cookies).toMatchObject([COOKIE]);

    const storage = await page.evaluate(() => {
      return {
        localStorage: { ...localStorage },
        sessionStorage: { ...sessionStorage },
      };
    });
    expect(storage).toEqual({
      localStorage: { hello: 'world' },
      sessionStorage: { in: 'sessionStorage' },
    });

    await newBrowser.close();
  });
});
