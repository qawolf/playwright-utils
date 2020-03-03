import { Browser, Page } from 'playwright';
import { launch } from '../../src/launch';
import { PlaywrightUtilsWeb } from '../../src/web';
import { WEB_SCRIPT } from '../../src/webScript';

import { initEvaluateScript } from '../../src/initEvaluateScript';

let page: Page;

const formatArgument = (arg: any, isSelector = false): Promise<any> => {
  return page.evaluate(
    (arg, isSelector) => {
      const playwrightutils: PlaywrightUtilsWeb = (window as any)
        .playwrightutils;

      if (isSelector) {
        return playwrightutils.formatArgument(document.querySelector(arg));
      }
      return playwrightutils.formatArgument(arg);
    },
    arg,
    isSelector,
  );
};

const interceptConsoleLogs = (): Promise<void> => {
  return page.evaluate(() => {
    const playwrightutils: PlaywrightUtilsWeb = (window as any).playwrightutils;

    return playwrightutils.interceptConsoleLogs((window as any).callback);
  });
};

describe('interceptConsoleLogs', () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await launch();
    page = await browser.newPage();

    await initEvaluateScript(page, WEB_SCRIPT);
  });

  afterEach(async () => {
    await page.close();
    await browser.close();
  });

  describe('formatArgument', () => {
    it('returns argument if argument is a string', async () => {
      const result = await formatArgument('Hello!');
      expect(result).toBe('Hello!');
    });

    it('returns xpath of argument if argument is a node', async () => {
      await page.setContent('<button id="button">Submit</button>');

      const result = await formatArgument('#button', true);
      expect(result).toBe("//*[@id='button']");
    });

    it('returns stringified argument if argument is JSON', async () => {
      const result = await formatArgument('{"hello":"world"}');
      expect(result).toBe('{"hello":"world"}');
    });

    it('returns argument as string if possible', async () => {
      const result = await formatArgument(11);
      expect(result).toBe('11');
    });
  });

  describe('interceptConsoleLogs', () => {
    it('calls callback with level and message', async () => {
      const callback = jest.fn();
      await page.exposeFunction('callback', callback);

      await interceptConsoleLogs();

      await page.evaluate(() => console.log('hello'));
      expect(callback).toBeCalledWith('log', 'hello');

      await page.evaluate(() => console.error('demogorgon'));
      expect(callback).toBeCalledWith('error', 'demogorgon');
    });
  });
});
