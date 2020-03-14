import './await-outside';
import { addAwaitOutsideToReplServer } from 'await-outside';
import Debug from 'debug';
import { EventEmitter } from 'events';
import { bold } from 'kleur';
import { start, REPLServer } from 'repl';
import * as tempy from 'tempy'
import open from 'open'

const debug = Debug('playwright-utils:repl');

export type Callback<S = void, T = void> = (data?: S) => T;

export class ReplContext extends EventEmitter {
  private static _instance = new ReplContext();

  public static data(): {} {
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

  replServer.defineCommand('screenshot', {
    help: 'Takes a screenshot and opens it in the default viewer of the OS',
    action: async (browserPageContextVariable) => {
      // Setting it as the function parameter defaults does not work, because it's always defined.
      if (!browserPageContextVariable) {
        browserPageContextVariable = "page"
      }
      if (!(browserPageContextVariable in replServer.context)) {
        throw new Error(`No browser instance with the name '${browserPageContextVariable}' existing in the context. ` +
          'Have you forgotten to pass it to the REPL context or do you have a custom page variable name? ' +
          `Then pass it as a parameter to the '.screenshot myExamplePageVariable' command.`)
      }
      const path = tempy.file({ extension: 'png' });
      await replServer.context[browserPageContextVariable].screenshot({ path })
      open(path)
      console.log(`File was opened in the editor`);
    }
  });

  addAwaitOutsideToReplServer(replServer);

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
