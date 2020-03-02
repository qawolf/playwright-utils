import Debug from 'debug';
import { BrowserContext, Page } from 'playwright-core';

const debug = Debug('playwright-utils:indexPages');

type IndexedBrowserContext = BrowserContext & {
  _putils_indexed: boolean;
};

export type IndexedPage = Page & {
  createdIndex: number;
};

export const indexPages = async (context: BrowserContext) => {
  /**
   * Set page.createdIndex on pages.
   */
  if ((context as IndexedBrowserContext)._putils_indexed) return;
  (context as IndexedBrowserContext)._putils_indexed = true;

  let index = 0;

  const pages = await context.pages();
  if (pages.length > 1) {
    throw new Error('Cannot index pages when >1 exists');
  }

  if (pages[0]) {
    debug(`index existing page ${index}`);
    (pages[0] as IndexedPage).createdIndex = index++;
  }

  // TODO remove cast after PR is merged
  (context as any).on('page', async event => {
    debug(`index created page ${index}`);
    const page: IndexedPage = await event.page();
    page.createdIndex = index++;
  });
};
