import { ensureFile, writeJSON } from 'fs-extra';
import { Page } from 'playwright';
import { NetworkCookie } from 'playwright-core/lib/network';

export interface State {
  cookies: NetworkCookie[];
  localStorage: object;
  sessionStorage: object;
}

const getState = async (page: Page): Promise<State> => {
  const context = page.context();
  const cookies = await context.cookies();
  const { localStorage, sessionStorage } = await page.evaluate(() => {
    return {
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
    };
  });

  return { cookies, localStorage, sessionStorage };
};

export const saveState = async (
  page: Page,
  savePath: string,
): Promise<void> => {
  const state = await getState(page);

  await ensureFile(savePath);
  return writeJSON(savePath, state);
};
