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

export const patchConsole = (): void => {
  if ((window as any).pwutilsPatchedConsole) return;
  (window as any).pwutilsPatchedConsole = true;

  LOG_LEVELS.forEach((level: keyof Console) => {
    const browserLog = console[level].bind(console);

    console[level] = (...args: any): void => {
      const message: string = args
        .map((arg: any) => formatArgument(arg))
        .join(' ');

      browserLog(...args);

      const callbacks = (window as any).pwutilsLogCallbacks || [];
      callbacks.forEach((callback: LogCallback) => {
        callback(level, message);
      });
    };
  });
};

export const interceptConsoleLogs = (callbackName: string): void => {
  patchConsole();

  const callbacks = (window as any).pwutilsLogCallbacks || [];
  callbacks.push(window[callbackName]);
  (window as any).pwutilsLogCallbacks = callbacks;
};
