import { BrowserContext } from 'playwright';
import { LifecycleEvent } from 'playwright-core/lib/types';
import { indexPages, IndexedPage } from './indexPages';
import { waitFor } from '../waitFor';

interface WaitForPageOptions {
  timeout?: number;
  waitUntil?: LifecycleEvent;
}

export const waitForPage = async (
  context: BrowserContext,
  index: number,
  options: WaitForPageOptions = {},
): Promise<IndexedPage> => {
  // index pages if they are not yet
  await indexPages(context);

  const page = await waitFor(
    async () => {
      const pages = await context.pages();
      const match = pages.find(
        page => (page as IndexedPage).createdIndex === index,
      );
      return match;
    },
    { timeout: options.timeout || 30000 },
  );

  await page.waitForLoadState({ waitUntil: options.waitUntil || 'load' });

  return page as IndexedPage;
};
