import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export const readFile = (filepath) => readFileSync(filepath, 'utf-8');

export const parseFile = (filepath) => {
  const extension = path.extname(filepath).slice(1).toLowerCase();
  const parsers = {
    json: JSON.parse,
    yml: yaml.load,
    yaml: yaml.load,
  };

  return parsers[extension];
};

export const readAndParseFile = (filepath) => {
  const data = readFile(filepath);
  const parse = parseFile(filepath);

  return parse(data);
};

export const getLine = (file, key) => `${key}: ${file[key]}\n`;

export const compareFiles = (file1, file2) => {
  const keys = new Set([...Object.keys(file1), ...Object.keys(file2)].sort());
  let res = [];

  keys.forEach((key) => {
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
  });

  res = `{\n${res.join('')}}`;

  console.log(res);

  return res;
};

export const readAndCompareFiles = (filepath1, filepath2) => {
  const file1 = readAndParseFile(filepath1);
  const file2 = readAndParseFile(filepath2);
  const result = compareFiles(file1, file2);

  return result;
};
