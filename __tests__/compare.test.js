import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

import { compareFiles } from '../src/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Test compare util', () => {
  const commonPath = `${__dirname}/../__fixtures__`;
  const filePath1 = `${commonPath}/file1.json`;
  const filePath2 = `${commonPath}/file2.json`;
  const file1 = JSON.parse(fs.readFileSync(filePath1, 'utf-8'));
  const file2 = JSON.parse(fs.readFileSync(filePath2, 'utf-8'));

  const result = fs.readFileSync(`${commonPath}/result.txt`, 'utf-8');

  expect(compareFiles(file1, file2)).toEqual(result);
});
