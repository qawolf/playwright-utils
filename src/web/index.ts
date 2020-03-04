import {
  formatArgument,
  interceptConsoleLogs,
  patchConsole,
} from './interceptConsoleLogs';

patchConsole();

const web = {
  formatArgument,
  interceptConsoleLogs,
};

export type PlaywrightUtilsWeb = typeof web;

export { formatArgument, interceptConsoleLogs } from './interceptConsoleLogs';
