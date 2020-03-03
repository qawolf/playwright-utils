import { launch } from '../src/launch';
import { initEvaluateScript } from '../src/initEvaluateScript';
import { Browser } from 'playwright-core';

let browser: Browser;

beforeAll(async () => {
  browser = await launch();
});

afterAll(() => browser.close());

it('ignores errors caused by navigation', async () => {
  const page = await browser.newPage();
  const navigation = page.goto('https://example.org');
  await initEvaluateScript(page, () => console.log('noop'));
  await navigation;
});

it('runs now and on navigation', async () => {
  const page = await browser.newPage();

  let runTimes = 0;

  await page.exposeFunction('incrementRuns', () => {
    runTimes++;
  });

  await initEvaluateScript(page, () => (window as any).incrementRuns());
  expect(runTimes).toEqual(1);

  await page.goto('about:blank');
  expect(runTimes).toEqual(2);
});
