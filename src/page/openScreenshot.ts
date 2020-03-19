import { ChildProcess } from 'child_process';
import open from 'open';
import { Page } from 'playwright';
import * as tempy from 'tempy';

export const openScreenshot = async (page: Page): Promise<ChildProcess> => {
  const path = tempy.file({ extension: 'png' });
  await page.screenshot({ path });
  const process = await open(path);
  return process;
};
