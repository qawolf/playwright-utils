import { Page } from 'playwright-core';
import { initEvaluateScript } from './initEvaluateScript';
import { PlaywrightUtilsWeb } from './web';
import { WEB_SCRIPT } from './webScript';
import { LogCallback } from './web/interceptConsoleLogs';

interface InterceptConsoleLogsArgs {
  callback: LogCallback;
  page: Page;
}

let logCallbackId = 0;

export const interceptConsoleLogs = async ({
  callback,
  page,
}: InterceptConsoleLogsArgs): Promise<void> => {
  await initEvaluateScript(page, WEB_SCRIPT);

  const callbackName = `interceptLogs${logCallbackId++}`;
  await page.exposeFunction(callbackName, callback);

  await initEvaluateScript(
    page,
    (callbackName: string) => {
      const web: PlaywrightUtilsWeb = (window as any).playwrightutils;
      web.interceptConsoleLogs(callbackName);
    },
    callbackName,
  );
};
