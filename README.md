# playwright-utils

[![npm version](https://badge.fury.io/js/playwright-utils.svg)](https://badge.fury.io/js/playwright-utils) ![Unit Tests](https://github.com/qawolf/playwright-utils/workflows/Unit%20Tests/badge.svg)

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

#### playwright-utils.openScreenshot(page)

- `page` <[Page]> Take a screenshot of this page and open it.
- returns: <[Promise]<[ChildProcess]>> Promise that resolves the viewer process.

Open a screenshot in the default viewer of the OS.

```js
await openScreenshot(page);
```

#### playwright-utils.repl([context])

- `context` <[Object]> Each key of this object is set on the repl.context so it can be accessed.
- returns: <[Promise]<[void]>> Promise that resolves after the REPL is closed.

Open a Node REPL.

```js
// pass a page so it can be accessed in the REPL
await repl({ page });
```

In the repl, type `screenshot [page]` to open a screenshot.

```bash
# open a screenshot of page 0
.screenshot
# open a screenshot of page 1
.screenshot 1
```

#### playwright-utils.saveArtifacts(context, saveDir)

- `context` <[BrowserContext]> The browser context.
- `saveDir` <[string]> The directory where artifacts (video and console logs) will be saved.

Save a video and console logs for each page of the context. Videos are saved at `${saveDir}/video_${pageIndex}_${timestamp}.mp4`, and console logs are saved at `${saveDir}/logs_${pageIndex}_${timestamp}.txt`. `pageIndex` corresponds to the index of the page starting at `0`.

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

#### playwright-utils.saveState(page, savePath)

- `page` <[Page]> Save the state (cookies, [localStorage], [sessionStorage]) of this page.
- `savePath` <[string]> Path where state will be saved as [JSON].

Save the state of a page (cookies, [localStorage], [sessionStorage]) to the specified file as [JSON].

```js
await saveState(page, 'admin.json');
```

#### playwright-utils.scroll(page, selector, options)

- `page` <[Page]> Find the element to scroll on this page.
- `selector` <[string]> Selector of the element to scroll.
- `options` <[Object]>
  - `x` <[number]> horizontal position to scroll element to in pixels.
  - `y` <[number]> vertical position to scroll element to in pixels.
  - `timeout` <?[number]> maximum time to wait for element to reach scroll position in milliseconds. Defaults to `30000` (30 seconds).
  - `waitUntil` <?"commit"|"load"|"domcontentloaded"|"networkidle0"|"networkidle2"> When to consider navigation succeeded before trying to scroll. Defaults to `"load"`.

Scrolls an element to the specified `x` and `y` position. It will keep trying to scroll the element to the specified position until `timeout` milliseconds have passed.

If the element cannot be scrolled at all before timeout, an error is thrown.

```js
await scroll(page, '#container', { x: 0, y: 500 });
```

#### playwright-utils.setState(page, savePath)

- `page` <[Page]> Apply the saved state (cookies, [localStorage], [sessionStorage]) to this page.
- `savePath` <[string]> Path where state [JSON] is saved.

Sets the state of a page (cookies, [localStorage], [sessionStorage]) to the [JSON] saved in the specified path.

```js
await setState(page, 'admin.json');
```

#### playwright-utils.stopVideos()

- returns: <[Promise]> Resolves after videos are saved.

Stop and wait for all videos started by [saveArtifacts](#playwright-utilssaveartifactscontext-savedir) to save.

[browser]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-browser 'browser'
[browsercontext]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-browsercontext 'BrowserContext'
[browsertype.launch]: https://github.com/microsoft/playwright/blob/master/docs/api.md#browsertypelaunchoptions 'browserType.launch'
[childprocess]: https://nodejs.org/api/child_process.html#child_process_class_childprocess 'ChildProcess'
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function 'Function'
[json]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON 'JSON'
[localstorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage 'localStorage'
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number 'number'
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object 'Object'
[page]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-page 'Page'
[page.evaluate]: https://github.com/microsoft/playwright/blob/master/docs/api.md#pageevaluatepagefunction-args 'page.evaluate'
[page.addinitscript]: https://github.com/microsoft/playwright/blob/master/docs/api.md#pageaddinitscriptscript-args 'page.addInitScript'
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise 'Promise'
[serializable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description 'Serializable'
[sessionstorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage 'sessionStorage'
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type 'String'
