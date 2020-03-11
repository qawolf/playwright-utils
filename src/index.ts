// context utils
export { forEachPage } from './context/forEachPage';
export { saveArtifacts, stopVideos } from './context/saveArtifacts';

// page utils
export { initEvaluateScript } from './page/initEvaluateScript';
export { interceptConsoleLogs } from './page/interceptConsoleLogs';
export { saveConsoleLogs } from './page/saveConsoleLogs';
export { saveState } from './page/saveState';
export { scroll } from './page/scroll';
export { setState } from './page/setState';

// global utils
export { getLaunchOptions, launch } from './launch';
export { repl, ReplContext } from './repl';

// internal use (for now)
export { register } from './register';
export { waitFor } from './waitFor';
export { indexPages, IndexedPage } from './context/indexPages';
export { waitForPage } from './context/waitForPage';
