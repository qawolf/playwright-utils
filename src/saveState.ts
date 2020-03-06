import { ensureFile, writeJSON } from 'fs-extra';
import { BrowserContext, Page } from 'playwright-core';
import { NetworkCookie } from 'playwright-core/lib/network';

interface GetStateOptions {
  context: BrowserContext;
  page: Page;
}

export interface State {
  cookies: NetworkCookie[];
  localStorage: object;
  sessionStorage: object;
}

interface SaveStateOptions extends GetStateOptions {
  savePath: string;
}

const getState = async ({ context, page }: GetStateOptions): Promise<State> => {
  const cookies = await context.cookies();
  const { localStorage, sessionStorage } = await page.evaluate(() => {
    return { localStorage, sessionStorage };
  });

  return { cookies, localStorage, sessionStorage };
};

export const saveState = async ({
  context,
  page,
  savePath,
}: SaveStateOptions): Promise<void> => {
  const state = await getState({ context, page });

  await ensureFile(savePath);
  return writeJSON(savePath, state);
};
