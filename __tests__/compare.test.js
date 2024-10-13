import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

import { readAndCompareFiles } from '../src/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.each(['json', 'yml', 'yaml'])('Test compare util with %s extention', (extension) => {
  const commonPath = `${__dirname}/../__fixtures__`;
  const filePath1 = `${commonPath}/${extension}/file1.${extension}`;
  const filePath2 = `${commonPath}/${extension}/file2.${extension}`;
  const result = fs.readFileSync(`${commonPath}/result.txt`, 'utf-8');

  expect(readAndCompareFiles(filePath1, filePath2)).toEqual(result);
});
