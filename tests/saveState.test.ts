import { pathExists, readJSON } from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { Browser } from 'playwright';
import { launch } from '../src/launch';
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

describe('saveState', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await launch();
  });

  afterAll(() => browser.close());

  it('saves state to the specified file', async () => {
    const savePath = join(tmpdir(), randomString(), 'state.json');

    const page = await browser.newPage();
    await page.goto('http://localhost:5000');

    await page.context().setCookies([COOKIE]);
    await page.evaluate(() => {
      localStorage.setItem('hello', 'world');
      sessionStorage.setItem('in', 'sessionStorage');
    });

    await saveState(page, savePath);

    const isStateSaved = await pathExists(savePath);
    expect(isStateSaved).toBe(true);

    const state = await readJSON(savePath);
    expect(state).toMatchSnapshot();
  });
});
