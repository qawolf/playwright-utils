import './await-outside';
import { addAwaitOutsideToReplServer } from 'await-outside';
import Debug from 'debug';
import { EventEmitter } from 'events';
import { bold } from 'kleur';
import { start, REPLServer } from 'repl';

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
