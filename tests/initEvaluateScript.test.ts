import { launch } from '../src/launch';
import { initEvaluateScript } from '../src/initEvaluateScript';

it('runs now and on navigation', async () => {
  const browser = await launch();
  const page = await browser.newPage();

  let runTimes = 0;

  await page.exposeFunction('incrementRuns', () => {
    runTimes++;
  });

  await initEvaluateScript(page, () => (window as any).incrementRuns());
  expect(runTimes).toEqual(1);

  await page.goto('about:blank');
  expect(runTimes).toEqual(2);

  await browser.close();
});
