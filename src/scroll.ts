import { ElementHandle, Page } from 'playwright-core';

interface ScrollValue {
  x: number;
  y: number;
}

interface ScrollOptions extends ScrollValue {
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15000;

const getScrollValue = (
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
  { timeoutMs, x, y }: ScrollOptions,
): Promise<void> => {
  const elementHandle = await page.waitForSelector(selector);
  const startScrollValue = await getScrollValue(page, elementHandle);

  try {
    await page.waitForFunction(
      (element: Element, { x, y }: ScrollValue): boolean => {
        element.scroll(x, y);
        return element.scrollLeft === x && element.scrollTop === y;
      },
      { polling: 100, timeout: timeoutMs || DEFAULT_TIMEOUT_MS },
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

    console.error(`could not scroll element`, elementHandle);
    throw new Error(`could not scroll element ${selector}`);
  }
};
