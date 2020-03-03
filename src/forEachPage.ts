import { BrowserContext, Page } from 'playwright-core';

export const forEachPage = async (
  context: BrowserContext,
  pageFn: (page: Page) => void | Promise<void>,
): Promise<void> => {
  // XXX remove cast after playwright fixes types
  (context as any).on('page', async event => pageFn(await event.page()));
  const pages = await context.pages();
  await Promise.all([pages.map(page => pageFn(page))]);
};
