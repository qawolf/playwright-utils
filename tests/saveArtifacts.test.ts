import { existsSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Browser } from 'playwright';
import * as playwrightVideo from 'playwright-video';
import { launch } from '../src/launch';
import { saveArtifacts } from '../src/saveArtifacts';
import { randomString, waitUntil } from './utils';

describe('saveArtifacts', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await launch();
  });

  afterAll(() => browser.close());

  it('saves a video and console logs to specified directory', async () => {
    const saveDir = join(tmpdir(), randomString());

    const context = await browser.newContext();
    const page = await context.newPage();
    const page2 = await context.newPage();

    await saveArtifacts(context, saveDir);

    await page.evaluate(() => console.log('hello'));
    await page2.evaluate(() => console.info('world'));

    await waitUntil(() => existsSync(join(saveDir, 'logs_0.txt')));
    await waitUntil(() => existsSync(join(saveDir, 'logs_1.txt')));

    await context.close();

    const testFn = (): Promise<[void, void]> =>
      Promise.all([
        waitUntil(() => existsSync(join(saveDir, 'video_0.mp4'))),
        waitUntil(() => existsSync(join(saveDir, 'video_1.mp4'))),
      ]);

    await expect(testFn()).resolves.not.toThrowError();
    // wait for video capture to finish closing
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  it('only saves console logs if ffmpeg not installed', async () => {
    jest.spyOn(playwrightVideo, 'getFfmpegPath').mockReturnValue(null);

    const saveDir = join(tmpdir(), randomString());
    const logFile = join(saveDir, 'logs_0.txt');
    const logFile2 = join(saveDir, 'logs_1.txt');

    const context = await browser.newContext();
    const page = await context.newPage();
    const page2 = await context.newPage();

    await saveArtifacts(context, saveDir);

    await page.evaluate(() => console.log('hello'));
    await page2.evaluate(() => console.info('world'));

    await waitUntil(() => existsSync(logFile));
    const lines = readFileSync(logFile, 'utf8').split('\n');
    expect(lines).toEqual(['log: hello', '']);

    await waitUntil(() => existsSync(logFile2));
    const lines2 = readFileSync(logFile2, 'utf8').split('\n');
    expect(lines2).toEqual(['info: world', '']);

    expect(existsSync(join(saveDir, 'video_0.mp4'))).toBe(false);

    await context.close();
    jest.resetAllMocks();
  });
});
