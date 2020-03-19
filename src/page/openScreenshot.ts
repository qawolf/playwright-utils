import open from 'open';
import { Page } from 'playwright';
import * as tempy from 'tempy';

export const openScreenshot = async (page: Page): Promise<void> => {
  const path = tempy.file({ extension: 'png' });
  await page.screenshot({ path });
  await open(path);
};
