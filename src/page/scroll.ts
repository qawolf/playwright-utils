import { ElementHandle, Page } from 'playwright';
import { LifecycleEvent } from 'playwright-core/lib/types';

export interface ScrollValue {
  x: number;
  y: number;
}

export interface ScrollOptions extends ScrollValue {
  timeout?: number;
  waitUntil?: LifecycleEvent;
}

const DEFAULT_TIMEOUT = 30000; // milliseconds

export const getScrollValue = (
  page: Page,
  elementHandle: ElementHandle<Element>,
): Promise<ScrollValue> => {
  return page.evaluate(element => {
    return { x: element.scrollLeft, y: element.scrollTop };
  }, elementHandle);
};

export const scroll = async (
  page: Page,
  selector: string,
  { timeout, x, y, waitUntil }: ScrollOptions,
): Promise<void> => {
  await page.waitForLoadState({ waitUntil: waitUntil || 'load' });

  const elementHandle = await page.waitForSelector(selector);
  const startScrollValue = await getScrollValue(page, elementHandle);

  try {
    await page.waitForFunction(
      (element: Element, { x, y }: ScrollValue): boolean => {
        element.scroll(x, y);
        return element.scrollLeft === x && element.scrollTop === y;
      },
      { polling: 100, timeout: timeout || DEFAULT_TIMEOUT },
      elementHandle,
      { x, y },
    );
  } catch (error) {
    const endScrollValue = await getScrollValue(page, elementHandle);
    if (
      startScrollValue.x !== endScrollValue.x ||
      startScrollValue.y !== endScrollValue.y
    ) {
      // were able to scroll at least somewhat, don't throw error
      return;
    }

    throw new Error(`could not scroll element ${selector}`);
  }
};
