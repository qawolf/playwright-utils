import { Browser, BrowserContext } from 'playwright-core';
import { indexPages, IndexedPage, launch } from '../../src';

describe('indexPages', () => {
  let browser: Browser;
  let context: BrowserContext;

  beforeEach(async () => {
    browser = await launch();
    context = await browser.newContext();
  });

  afterEach(() => browser.close());

  it('indexes the first existing page', async () => {
    const page = await context.newPage();
    await indexPages(context);
    expect((page as IndexedPage).createdIndex).toEqual(0);
  });

  it('indexes newly created pages', async () => {
    await indexPages(context);
    const pageOne = await context.newPage();
    const pageTwo = await context.newPage();

    // give time for page event to fire
    await new Promise(resolve => setTimeout(resolve, 0));

    expect((pageOne as IndexedPage).createdIndex).toEqual(0);
    expect((pageTwo as IndexedPage).createdIndex).toEqual(1);
  });

  it('throws an error if more than one page already exists', async () => {
    expect.assertions(1);
    await context.newPage();
    await context.newPage();
    return indexPages(context).catch(e => {
      expect(e.message).toEqual('Cannot index pages when >1 exists');
    });
  });
});