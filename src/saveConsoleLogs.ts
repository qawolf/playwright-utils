import { appendFileSync } from 'fs';
import { ensureDir } from 'fs-extra';
import { dirname } from 'path';
import { Page } from 'playwright-core';
import { interceptConsoleLogs } from './interceptConsoleLogs';

export const saveConsoleLogs = async (
  page: Page,
  savePath: string,
): Promise<void> => {
  await ensureDir(dirname(savePath));

  const callback = (level: string, message: string): void => {
    const line = `${level}: ${message}\n`;
    appendFileSync(savePath, line);
  };

  return interceptConsoleLogs(page, callback);
};
