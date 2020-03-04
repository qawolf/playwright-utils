import Debug from 'debug';
import { platform } from 'os';
// need to launch from playwright not playwright-core since the browsers are different
import * as playwright from 'playwright';
import { LaunchOptions as PlaywrightLaunchOptions } from 'playwright-core/lib/server/browserType';
import { isNullOrUndefined } from 'util';

const debug = Debug('playwright-utils:launch');

type BrowserName = 'chromium' | 'firefox' | 'webkit';

export type LaunchOptions = PlaywrightLaunchOptions & {
  browserName?: BrowserName;
};

const parseBool = (value: string | undefined): boolean => {
  const lowerCaseValue = (value || '').toLowerCase();
  return ['1', 't', 'true'].includes(lowerCaseValue);
};

const parseBrowserName = (name?: string): BrowserName => {
  if (name === 'firefox' || name === 'webkit') return name;
  return 'chromium';
};

export const getLaunchOptions = (
  options: LaunchOptions = {},
): LaunchOptions & { browserName: BrowserName } => {
  const launchOptions = { ...options };

  const headlessEnv = process.env.QAW_HEADLESS;
  if (isNullOrUndefined(options.headless) && !isNullOrUndefined(headlessEnv)) {
    launchOptions.headless = parseBool(headlessEnv);
  }

  const browserName = parseBrowserName(
    options.browserName || process.env.QAW_BROWSER,
  );

  if (isNullOrUndefined(options.args)) {
    let args: string[] = [];
    if (browserName === 'chromium') {
      args = [
        '--disable-dev-shm-usage',
        '--no-default-browser-check',
        '--window-position=0,0',
      ];

      if (platform() === 'linux') {
        // We use --no-sandbox because we cannot change the USER for certain CIs (like GitHub).
        // "Ensure your Dockerfile does not set the USER instruction, otherwise you will not be able to access GITHUB_WORKSPACE"
        args.push('--no-sandbox');
      }
    }
  }

  return { ...launchOptions, browserName };
};

export const launch = async (
  options: LaunchOptions = {},
): Promise<playwright.Browser> => {
  const launchOptions = getLaunchOptions(options);
  debug('launch %j', launchOptions);

  const browser = await playwright[launchOptions.browserName].launch(
    launchOptions,
  );
  return browser;
};
