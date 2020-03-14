import { mockProcessStdout } from 'jest-mock-process';
import { REPLServer } from 'repl';
const openSpy = jest.fn()
jest.mock("open", () => ({
  __esModule: true,
  default: openSpy
}))
const tempyFileSpy = jest.fn()
jest.mock("tempy", () => ({
  __esModule: true,
  file: tempyFileSpy
}))

import { repl as createRepl } from '../src';

const mockedStdout: jest.SpyInstance = mockProcessStdout();

describe('repl()', () => {
  let replServer: REPLServer;
  let resolved = false;

  const createReplWrapper = (context = {}): Promise<boolean> => createRepl(context, instance => (replServer = instance)).then(
    () => (resolved = true),
  )

  afterAll(() => {
    mockedStdout.mockRestore();
  });

  it('opens a repl', () => {
    createReplWrapper()
    const messages: string[] = mockedStdout.mock.calls.map(args => args[0]);
    expect(messages).toContain('> ');
  });

  it('resolves after the repl is closed', async () => {
    createReplWrapper()
    expect(resolved).toEqual(false);
    replServer.close();
    await new Promise(r => setTimeout(r, 0));
    expect(resolved).toEqual(true);
  });

  it('should be able to take screenshots and have page as default context variable', async () => {
    const tmpPath = "/tmp/foo123.png"
    tempyFileSpy.mockReturnValueOnce(tmpPath)
    const screenshotSpy = jest.fn().mockReturnValueOnce(new Promise(resolve => resolve()))
    createReplWrapper({
      page: {
        screenshot: screenshotSpy
      }
    })
    const screenshotAction = replServer.commands["screenshot"]
    await screenshotAction.action.bind(replServer)(null)
    expect(screenshotSpy).toHaveBeenCalledTimes(1)
    expect(openSpy).toHaveBeenCalledTimes(1)
    expect(openSpy).toHaveBeenCalledWith(tmpPath)
    replServer.close();
  })

  it('should be able to take screenshots and have a custom page variable', async () => {
    const tmpPath = "/tmp/foo123.png"
    tempyFileSpy.mockReturnValueOnce(tmpPath)
    const screenshotSpy = jest.fn().mockReturnValueOnce(new Promise(resolve => resolve()))
    createReplWrapper({
      custom: {
        screenshot: screenshotSpy
      }
    })
    const screenshotAction = replServer.commands["screenshot"]
    await screenshotAction.action.bind(replServer)("custom")
    expect(screenshotSpy).toHaveBeenCalledTimes(1)
    replServer.close();
  })
});
