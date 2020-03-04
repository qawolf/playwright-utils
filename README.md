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

[browser]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-browser 'browser'
[browsercontext]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-browsercontext 'BrowserContext'
[browsertype.launch]: https://github.com/microsoft/playwright/blob/master/docs/api.md#browsertypelaunchoptions 'browserType.launch'
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function 'Function'
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object 'Object'
[page]: https://github.com/microsoft/playwright/blob/master/docs/api.md#class-page 'Page'
[page.evaluate]: https://github.com/microsoft/playwright/blob/master/docs/api.md#pageevaluatepagefunction-args 'page.evaluate'
[page.addinitscript]: https://github.com/microsoft/playwright/blob/master/docs/api.md#pageaddinitscriptscript-args 'page.addInitScript'
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise 'Promise'
[serializable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Description 'Serializable'
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type 'String'
