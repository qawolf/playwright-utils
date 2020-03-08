import { Page } from 'playwright-core';

interface ScrollOptions {
  timeoutMs?: number;
  x: number;
  y: number;
}

const DEFAULT_TIMEOUT_MS = 15000;

export const scroll = async (
  page: Page,
  selector: string,
  { timeoutMs, x, y }: ScrollOptions,
): Promise<void> => {
  const elementHandle = await page.waitForSelector(selector);

  await page.evaluate(
    async (element, scrollValue, timeoutMs) => {
      console.debug('qawolf: scroll to', scrollValue, element);

      const { x, y } = scrollValue;
      const startScroll = {
        x: element.scrollLeft,
        y: element.scrollTop,
      };
      const start = Date.now();

      const isScrolled = () =>
        element.scrollLeft === x && element.scrollTop === y;
      const sleep = (sleepMs: number) =>
        new Promise(resolve => setTimeout(resolve, sleepMs));

      do {
        element.scroll(x, y);
        await sleep(100);
      } while (!isScrolled() && Date.now() - start < timeoutMs);

      if (isScrolled()) {
        console.debug('qawolf: scroll succeeded');
        return;
      }

      console.debug('qawolf: scroll timeout exceeded', {
        x: element.scrollLeft,
        y: element.scrollTop,
      });

      // only throw an error if it could not scroll at all
      if (
        element.scrollLeft === startScroll.x &&
        element.scrollTop === startScroll.y
      ) {
        throw new Error('could not scroll');
      }
    },
    elementHandle,
    { x, y },
    timeoutMs || DEFAULT_TIMEOUT_MS,
  );
};
