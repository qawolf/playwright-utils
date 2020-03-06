import { readJSON } from 'fs-extra';
import { BrowserContext, Page } from 'playwright-core';
import { State } from './saveState';

interface LoadStateOptions {
  context: BrowserContext;
  page: Page;
  savePath: string;
}

interface SetStorageOptions {
  items: object;
  page: Page;
  storageType: 'localStorage' | 'sessionStorage';
}

const setStorage = async ({
  items,
  page,
  storageType,
}: SetStorageOptions): Promise<void> => {
  if (!Object.keys(items).length) return;

  await page.evaluate(items => {
    window[storageType].clear();

    Object.keys(items).forEach(key => {
      window[storageType].setItem(key, items[key]);
    });
  }, items);
};

export const loadState = async ({
  context,
  page,
  savePath,
}: LoadStateOptions): Promise<void> => {
  const state: State = await readJSON(savePath);

  if (state.cookies.length) {
    await context.setCookies(state.cookies);
  }

  await setStorage({
    items: state.localStorage,
    page,
    storageType: 'localStorage',
  });
  await setStorage({
    items: state.sessionStorage,
    page,
    storageType: 'sessionStorage',
  });

  await page.reload();
};
