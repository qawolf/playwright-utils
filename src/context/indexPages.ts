import Debug from 'debug';
import { BrowserContext, Page } from 'playwright';

const debug = Debug('playwright-utils:indexPages');

type IndexedBrowserContext = BrowserContext & {
  _putilsIndexed: boolean;
};

export type IndexedPage = Page & {
  createdIndex: number;
};

export const indexPages = async (context: BrowserContext): Promise<void> => {
  /**
   * Set page.createdIndex on pages.
   */
  if ((context as IndexedBrowserContext)._putilsIndexed) return;
  (context as IndexedBrowserContext)._putilsIndexed = true;

  let index = 0;

  const pages = await context.pages();
  if (pages.length > 1) {
    throw new Error('Cannot index pages when >1 exists');
  }

  if (pages[0]) {
    debug(`index existing page ${index}`);
    (pages[0] as IndexedPage).createdIndex = index++;
  }

  // XXX remove cast after playwright fixes types
  (context as any).on('page', async event => {
    debug(`index created page ${index}`);
    const page: IndexedPage = await event.page();
    page.createdIndex = index++;
  });
};
