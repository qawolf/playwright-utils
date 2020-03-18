import { Page } from 'playwright';
import { forEachPage, launch } from '../../src';

it('runs for existing and new pages', async () => {
  const browser = await launch();
  const context = await browser.newContext();

  const existingPage = await context.newPage();

  let index = 0;

  await forEachPage(context, (page: Page) => {
    page.evaluate((index: number) => ((window as any).index = index), index++);
  });

  const newPage = await context.newPage();

  // give time for page event to fire
  await new Promise(resolve => setTimeout(resolve, 0));

  const result = await Promise.all(
    [existingPage, newPage].map(page =>
      page.evaluate(() => (window as any).index),
    ),
  );
  expect(result).toEqual([0, 1]);

  await browser.close();
});
