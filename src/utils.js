import { readFileSync } from 'fs';
import path from 'path';

export const isAbsolutePath = (filePath) => path.isAbsolute(filePath);

export const readFile = (filepath) => readFileSync(filepath, 'utf-8');

export const parseFile = (filepath, file) => {
  const type = path.extname(filepath).slice(1);
  const formatMapper = {
    json: (file) => JSON.parse(file),
  };

  return formatMapper[type](file);
};

export const readAndParseFile = (filepath) => {
  const data = readFile(filepath);

  return parseFile(filepath, data);
};

export const getLine = (file, key) => {
  return `${key}: ${file[key]}\n`;
};

export const compareFiles = (file1, file2) => {
  const keys = new Set([...Object.keys(file1), ...Object.keys(file2)].sort());
  let res = [];

  for (const key of keys) {
    const value1 = file1[key];
    const value2 = file2[key];

    if (value1 === value2) {
      res.push(`    ${getLine(file1, key)}`);
    } else if (value1 === undefined) {
      res.push(`  + ${getLine(file2, key)}`);
    } else if (value2 === undefined) {
      res.push(`  - ${getLine(file1, key)}`);
    } else {
      res.push(`  - ${getLine(file1, key)}`);
      res.push(`  + ${getLine(file2, key)}`);
    }
  }

  res = `{\n${res.join('')}}`;

  console.log(res);

  return res;
};
