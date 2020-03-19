import { REPLServer } from 'repl';
import { BrowserContext } from 'playwright';
import { waitForPage } from '../context/waitForPage';
import { openScreenshot } from '../page/openScreenshot';
import { ReplContext } from './ReplContext';

export const addScreenshotCommand = (replServer: REPLServer): void => {
  replServer.defineCommand('screenshot', {
    help: 'Take a screenshot and open it',
    action: async pageVariable => {
      let pageIndex = Number(pageVariable);
      if (isNaN(pageIndex)) pageIndex = 0;

      // There will be a context if playwright-utils.launch was used
      const context = ReplContext.data().context as BrowserContext;
      if (!context || !context.pages) {
        throw new Error(
          `No browser context found. Provide it to the "await repl({ context })"`,
        );
      }

      const page = await waitForPage(context, pageIndex, { waitUntil: null });
      await openScreenshot(page);
    },
  });
};
