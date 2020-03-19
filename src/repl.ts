import './await-outside';
import { addAwaitOutsideToReplServer } from 'await-outside';
import Debug from 'debug';
import { EventEmitter } from 'events';
import { bold } from 'kleur';
import { BrowserContext } from 'playwright';
import { start, REPLServer } from 'repl';
import { waitForPage } from './context/waitForPage';
import { openScreenshot } from './page/openScreenshot';

const debug = Debug('playwright-utils:repl');

export type Callback<S = void, T = void> = (data?: S) => T;

export class ReplContext extends EventEmitter {
  private static _instance = new ReplContext();

  public static data(): any {
    return this.instance()._data;
  }

  public static instance(): ReplContext {
    return this._instance;
  }

  public static set(key: string, value: any): void {
    const instance = this.instance();
    instance._data[key] = value;
    instance.emit('change', instance._data);
  }

  protected _data: {} = {};

  constructor() {
    super();
  }
}

export const addScreenshotCommand = (replServer: REPLServer) => {
  replServer.defineCommand('screenshot', {
    help: 'Take a screenshot and open it',
    action: async pageVariable => {
      let pageIndex = Number(pageVariable);
      if (isNaN(pageIndex)) pageIndex = 0;

      // There will be a context if playwright-utils.launch or qawolf.launch was used
      const context = ReplContext.data().context as BrowserContext;
      if (!context || !context.pages) {
        throw new Error(
          `No browser context found. Provide one to the repl({ context })`,
        );
      }

      const page = await waitForPage(context, pageIndex, { waitUntil: null });
      await openScreenshot(page);
    },
  });
};

export const repl = (
  context?: {},
  callback?: Callback<REPLServer>,
): Promise<void> => {
  /**
   * Create a REPL and resolve when it is closed.
   */
  if (context) {
    Object.keys(context).forEach(key => ReplContext.set(key, context[key]));
  }

  console.log(
    bold().yellow(
      'Type .exit to close the repl and continue running your code',
    ),
  );

  const replServer = start({
    terminal: true,
    useGlobal: true,
  });

  addAwaitOutsideToReplServer(replServer);

  addScreenshotCommand(replServer);

  const setContext = (): void => {
    const data = ReplContext.data();
    Object.keys(data).forEach(key => (replServer.context[key] = data[key]));
  };
  setContext();
  ReplContext.instance().on('change', setContext);

  if (callback) {
    callback(replServer);
  }

  return new Promise(resolve => {
    replServer.on('exit', () => {
      debug('exit');
      resolve();
    });
  });
};
