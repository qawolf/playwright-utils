import { Page } from 'playwright-core';
import {} from './initEvaluateScript';
import {
  interceptConsoleLogs as interceptConsoleLogsWeb,
  LogCallback,
} from './web/interceptConsoleLogs';

export const interceptConsoleLogs = (
  page: Page,
  callback: LogCallback,
): Promise<void> => {
  return page.addInitScript(() => interceptConsoleLogsWeb(callback));
};
