import { once } from 'lodash';

// https://gist.github.com/6174/6062387
export const randomString = (): string =>
  Math.random()
    .toString(36)
    .substring(2, 15);

export const waitUntil = (
  conditionFn: () => Promise<boolean> | boolean,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let intervalId: NodeJS.Timeout, timeoutId: NodeJS.Timeout;

    const done = once((success: boolean) => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      if (success) resolve();
      else reject();
    });

    intervalId = setInterval(async () => {
      if (await conditionFn()) done(true);
    }, 500);

    timeoutId = setTimeout(() => done(false), 5000);
  });
};
