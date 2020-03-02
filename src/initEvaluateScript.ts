import { Page } from 'playwright-core';

export const initEvaluateScript = (page: Page, script: string | Function) =>
  // TODO fix cast
  Promise.all([page.addInitScript(script), page.evaluate(script as any)]);
