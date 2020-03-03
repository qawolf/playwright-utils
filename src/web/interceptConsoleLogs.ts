import { getXpath } from '../utils';

export type LogCallback = (level: string, message: string) => void;

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

export const interceptConsoleLogs = (callbackName: string): void => {
  if ((window as any).pwInterceptConsoleLogs) return;
  (window as any).pwInterceptConsoleLogs = true;

  LOG_LEVELS.forEach((level: keyof Console) => {
    const browserLog = console[level].bind(console);

    console[level] = (...args: any) => {
      const message: string = args
        .map((arg: any) => formatArgument(arg))
        .join(' ');

      browserLog(...args);

      const callback = window[callbackName];
      if (callback) {
        callback(level, message);
      }
    };
  });
};
