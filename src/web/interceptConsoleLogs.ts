import { getXpath } from '../utils';

type LogCallback = (level: string, message: string) => void;

const LOG_LEVELS = ['debug', 'error', 'info', 'log', 'warn'];

export const formatArgument = (argument: any): string => {
  if (typeof argument === 'string') {
    return argument;
  }

  if (argument && argument.nodeName) {
    // log nodes as their xpath
    return getXpath(argument as Node);
  }

  try {
    return JSON.stringify(argument);
  } catch (e) {
    if (argument && argument.toString) {
      return argument.toString();
    }

    return '';
  }
};

// TODO wrapper that calls addInitScript that adds that library
export const interceptConsoleLogs = (callback: LogCallback): void => {
  if ((window as any).pwInterceptConsoleLogs) return;
  (window as any).pwInterceptConsoleLogs = true;

  LOG_LEVELS.forEach((level: keyof Console) => {
    const browserLog = console[level].bind(console);

    console[level] = (...args: any) => {
      const message: string = args
        .map((arg: any) => formatArgument(arg))
        .join(' ');

      browserLog(...args);

      callback(level, message);
    };
  });
};
