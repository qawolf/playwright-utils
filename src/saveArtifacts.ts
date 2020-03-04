import Debug from 'debug';
import { join } from 'path';
import { BrowserContext } from 'playwright-core';
import { getFfmpegPath, saveVideo } from 'playwright-video';
import { forEachPage } from './forEachPage';
import { saveConsoleLogs } from './saveConsoleLogs';

const debug = Debug('playwright-utils:saveArtifacts');

export const saveArtifacts = (
  context: BrowserContext,
  saveDir: string,
): Promise<void> => {
  // only record a video if ffmpeg installed
  const includeVideo = !!getFfmpegPath();
  let pageCount = 0;

  return forEachPage(context, async page => {
    let pageIndex = pageCount++;
    debug(`save artifacts for page ${pageIndex}`);

    try {
      await saveConsoleLogs(page, join(saveDir, `logs_${pageIndex}.txt`));

      if (includeVideo) {
        debug(`save video for page ${pageIndex}`);
        await saveVideo(page, join(saveDir, `video_${pageIndex}.mp4`));
      } else {
        debug(`ffmpeg not found, skipping video for page ${pageIndex}`);
      }
    } catch (error) {
      debug(`cannot save artifacts for page ${pageIndex}: ${error.message}`);
    }
  });
};
