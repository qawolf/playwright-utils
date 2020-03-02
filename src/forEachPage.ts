import { BrowserContext, Page } from 'playwright-core';

export const forEachPage = async (
  context: BrowserContext,
  pageFn: (page: Page) => void | Promise<void>,
) => {
  // TODO remove cast
  (context as any).on('page', async event => pageFn(await event.page()));
  const pages = await context.pages();
  await Promise.all([pages.map(page => pageFn(page))]);
};
