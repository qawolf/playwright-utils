import { readFileSync } from 'fs';
import { join } from 'path';

export const WEB_SCRIPT = readFileSync(
  join(__dirname.replace('/src', '/build'), 'playwrightutils.web.js'),
  'utf8',
).replace(
  'var playwrightutils =',
  'window.playwrightutils = window.playwrightutils ||',
);
