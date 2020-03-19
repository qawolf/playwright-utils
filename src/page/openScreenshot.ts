import { ChildProcess } from 'child_process';
import open from 'open';
import { Page } from 'playwright';
import { file } from 'tempy';

export const openScreenshot = async (page: Page): Promise<ChildProcess> => {
  const path = file({ extension: 'png' });
  await page.screenshot({ path });
  const process = await open(path);
  return process;
};
