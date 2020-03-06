import { readJSON } from 'fs-extra';
import { Page } from 'playwright-core';
import { State } from './saveState';

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

  await page.evaluate(
    (items, storageType) => {
      window[storageType].clear();

      Object.keys(items).forEach(key => {
        window[storageType].setItem(key, items[key]);
      });
    },
    items,
    storageType,
  );
};

export const setState = async (page: Page, savePath: string): Promise<void> => {
  const state: State = await readJSON(savePath);

  if (state.cookies.length) {
    const context = page.context();
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
};
