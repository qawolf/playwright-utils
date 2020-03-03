import { Page } from 'playwright-core';

export const initEvaluateScript = async (
  page: Page,
  script: string | Function,
  ...args: any[]
): Promise<unknown> => {
  const [, result] = await Promise.all([
    page.addInitScript(script, ...args),
    // TODO fix PageFunction cast
    page.evaluate(script as any, ...args),
  ]);

  return result;
};
