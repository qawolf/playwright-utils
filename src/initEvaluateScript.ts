import { Page } from 'playwright-core';

export const initEvaluateScript = async (
  page: Page,
  script: string | Function,
): Promise<unknown> => {
  const [, result] = await Promise.all([
    page.addInitScript(script),
    // TODO fix PageFunction cast
    page.evaluate(script as any),
  ]);

  return result;
};
