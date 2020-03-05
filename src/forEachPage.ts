import { BrowserContext, Page } from 'playwright-core';

export const forEachPage = async (
  context: BrowserContext,
  pageFn: (page: Page) => any,
): Promise<void> => {
  // XXX remove cast after playwright fixes types
  (context as any).on('page', async event => {
    const page = await event.page();

    pageFn(page);
  });

  const pages = await context.pages();
  const pagePromises = pages.map(page => pageFn(page));

  await Promise.all(pagePromises);
};
