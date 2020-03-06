# playwright-utils

[![npm version](https://badge.fury.io/js/playwright-utils.svg)](https://badge.fury.io/js/playwright-utils)

🛠️ Utilities for playwright.

```js
const { forEachPage, initEvaluateScript, launch } = require('playwright-utils');

(async () => {
  // launch the browser based on environment variables
  const browser = await launch();

  const context = await browser.newContext();

  // Run for every existing and new page
  await forEachPage(context, async page => {
    await initEvaluateScript(page, MY_SCRIPT);
  });

  await browser.close();
})();
```

#### playwright-utils.forEachPage(context, pageFunction)

- `context` <[BrowserContext]> The browser context.
- `pageFunction` <[function]> Callback function called for every existing and new page.
- returns: <[Promise]>

Run a function for every existing and new page.

```js
await forEachPage(context, (page: Page) => {
  // code to run for each page here
});
```

#### playwright-utils.initEvaluateScript(script[, ...args])

- `script` <[function]|[string]> Script to be evaluated in the page.
- `...args` <...[Serializable]> Arguments to pass to `script` (only supported when passing a function).
- returns: <[Promise]>

Call [page.addInitScript] and [page.evaluate] to run the script now and every time the page is navigated.

#### playwright-utils.interceptConsoleLogs(page, callback)

- `page` <[Page]> Intercept console logs on this page.
- `callback` <[Function]> Function to be called when console logs in the browser. Takes as arguments the log level and the message.

Call a specified function when console logs in the browser.

```js
const callback = (logLevel, message) => {
  // logLevel is one of 'debug', 'error', 'info', 'log', and 'warn'
  console.log(`Console logged ${message} at log level ${logLevel}`);
};

await interceptConsoleLogs(page, callback);
```

#### playwright-utils.launch([options])

- `options` <[Object]> Playwright [browserType.launch] options and these additional fields:
  - `browserName` <[string]> The browser to launch: "chromium", "firefox" or "webkit".
- returns: <[Promise]<[Browser]>> Promise which resolves to browser instance.

Launch the browser based on environment variables. Defaults to `QAW_BROWSER=chromium` and `QAW_HEADLESS=true`.

#### playwright-utils.repl([context])

- `context` <[Object]> Each key of this object is set on the repl.context so it can be accessed.
- returns: <[Promise]<[void]>> Promise that resolves after the REPL is closed.

Open a Node REPL.

```js
// pass a page so it can be accessed in the REPL
await repl({ page });
```

#### playwright-utils.saveArtifacts(context, saveDir)

- `context` <[BrowserContext]> The browser context.
- `saveDir` <[string]> The directory where artifacts (video and console logs) will be saved.

Save a video and console logs for each page of the context. Videos are saved at `${saveDir}/video_${pageIndex}.mp4`, and console logs are saved at `${saveDir}/logs_${pageIndex}.txt`. `pageIndex` corresponds to the index of the page starting at `0`.

If [FFmpeg](https://www.ffmpeg.org) is not installed, videos will not be included. Install `ffmpeg-static` as a dependency or set the `FFMPEG_PATH` environment variable.

```sh
npm i ffmpeg-static
```

```js
await saveArtifacts(context, '/artifacts');
```

#### playwright-utils.saveConsoleLogs(page, savePath)

- `page` <[Page]> Save console logs on this page.
- `savePath` <[string]> Path where console logs will be saved.

Save console logs on a page to the specified file.

```js
await saveConsoleLogs(page, 'logs.txt');
```

#### playwright-utils.stateState(page, savePath)

- `page` <[Page]> Save the state (cookies, [localStorage], [sessionStorage]) of this page.
- `savePath` <[string]> Path where state will be saved as [JSON].

Save the state of a page (cookies, [localStorage], [sessionStorage]) to the specified file as [JSON].

```js
await stateState(page, 'admin.json');
```

[browser]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-browser 'browser'
[browsercontext]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-browsercontext 'BrowserContext'
[browsertype.launch]: https://github.com/microsoft/playwright/blob/master/docs/api.md#browsertypelaunchoptions 'browserType.launch'
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function 'Function'
[json]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON 'JSON'
[localstorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage 'localStorage'
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object 'Object'
[page]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-page 'Page'
[page.evaluate]: https://github.com/microsoft/playwright/blob/master/docs/api.md#pageevaluatepagefunction-args 'page.evaluate'
[page.addinitscript]: https://github.com/microsoft/playwright/blob/master/docs/api.md#pageaddinitscriptscript-args 'page.addInitScript'
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise 'Promise'
[serializable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description 'Serializable'
[sessionstorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage 'sessionStorage'
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type 'String'
