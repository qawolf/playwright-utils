import { readFileSync } from 'fs';
import { join } from 'path';
import { Page } from 'playwright';
import { initEvaluateScript } from '../page/initEvaluateScript';

export const WEB_SCRIPT = readFileSync(
  join(__dirname.replace('/src', '/build'), '../playwrightutils.web.js'),
  'utf8',
).replace(
  'var playwrightutils =',
  'window.playwrightutils = window.playwrightutils ||',
);

type InjectedPage = Page & {
  _hasPlaywrightUtilsWeb: boolean;
};

export const addScript = async (page: Page): Promise<void> => {
  if ((page as InjectedPage)._hasPlaywrightUtilsWeb) return;
  (page as InjectedPage)._hasPlaywrightUtilsWeb = true;
  await initEvaluateScript(page, WEB_SCRIPT);
};
