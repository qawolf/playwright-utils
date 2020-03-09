import { pathExists, readFileSync } from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';
import { Browser } from 'playwright';
import * as playwrightVideo from 'playwright-video';
import { launch, getLaunchOptions, saveArtifacts } from '../../src';
import { randomString, waitUntil } from '../utils';

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

    // make sure there are logs
    await page.evaluate(() => console.log('hello'));
    await page2.evaluate(() => console.info('world'));

    expect(async () => {
      await waitUntil(() => pathExists(join(saveDir, 'logs_0.txt')));
      await waitUntil(() => pathExists(join(saveDir, 'logs_1.txt')));

      await context.close();

      // videos are chromium only for now
      if (getLaunchOptions().browserName !== 'chromium') return;
      await waitUntil(() => pathExists(join(saveDir, 'video_0.mp4')), 15000);
      await waitUntil(() => pathExists(join(saveDir, 'video_1.mp4')), 15000);
    }).not.toThrowError();
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

    await waitUntil(() => pathExists(logFile));
    const lines = readFileSync(logFile, 'utf8').split('\n');
    expect(lines).toEqual(['log: hello', '']);

    await waitUntil(() => pathExists(logFile2));
    const lines2 = readFileSync(logFile2, 'utf8').split('\n');
    expect(lines2).toEqual(['info: world', '']);

    expect(await pathExists(join(saveDir, 'video_0.mp4'))).toBe(false);

    await context.close();
    jest.resetAllMocks();
  });
});
