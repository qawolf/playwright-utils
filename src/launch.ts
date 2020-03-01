import * as Debug from 'debug';
import { platform } from 'os';
import playwright, { Browser } from 'playwright-core';
import { LaunchOptions as PlaywrightLaunchOptions } from 'playwright-core/lib/server/browserType';
import { isNullOrUndefined } from 'util';

const debug = Debug('playwright-utils:launch');

type BrowserName = 'chromium' | 'firefox' | 'webkit';

export type LaunchOptions = PlaywrightLaunchOptions & {
  browser?: BrowserName;
};

const parseBool = (value: string | undefined) => {
  const lowerCaseValue = (value || '').toLowerCase();
  return ['1', 't', 'true'].includes(lowerCaseValue);
};

const parseBrowserName = (name?: string): string => {
  if (name === 'firefox' || name === 'webkit') return name;
  return 'chromium';
};

export const getLaunchOptions = (options: LaunchOptions = {}) => {
  const launchOptions = { ...options };

  const headlessEnv = process.env.QAW_HEADLESS;
  if (isNullOrUndefined(options.headless) && !isNullOrUndefined(headlessEnv)) {
    launchOptions.headless = parseBool(headlessEnv);
  }

  const browserName = parseBrowserName(process.env.QAW_BROWSER);

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

export const launch = async (options: LaunchOptions = {}): Promise<Browser> => {
  const launchOptions = getLaunchOptions(options);
  debug('launch %j', launchOptions);

  const browser = await playwright[launchOptions.browserName].launch(
    launchOptions,
  );
  return browser;
};
