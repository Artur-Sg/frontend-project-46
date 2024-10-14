import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import _ from 'lodash';

export const readFile = (filepath) => readFileSync(filepath, 'utf-8');

export const parseFile = (filepath) => {
  const extension = path.extname(filepath).slice(1).toLowerCase();
  const parsers = {
    json: JSON.parse,
    yml: yaml.load,
    yaml: yaml.load,
  };

  const parser = parsers[extension];

  if (!parser) {
    throw new Error(`Unsupported file extension: ${extension}`);
  }

  return parser;
};

export const readAndParseFile = (filepath) => {
  const data = readFile(filepath);
  const parser = parseFile(filepath);

  return parser(data);
};

export const getLine = (key, value) => `${key}: ${value}\n`;

export const compareFiles = (file1, file2, depth = 1) => {
  const keys = new Set([...Object.keys(file1), ...Object.keys(file2)].sort());
  const indent = ' '.repeat(4 * depth);
  const smallIndent = ' '.repeat(4 * depth - 2);

  let res = [];

  keys.forEach((key) => {
    const value1 = file1[key];
    const value2 = file2[key];

    if (!_.isObject(value1) && !_.isObject(value2)) {
      if (value1 === value2) {
        res.push(`${indent}${getLine(key, value1)}`);
      } else if (value1 === undefined) {
        res.push(`${smallIndent}+ ${getLine(key, value2)}`);
      } else if (value2 === undefined) {
        res.push(`${smallIndent}- ${getLine(key, value1)}`);
      } else {
        res.push(`${smallIndent}- ${getLine(key, value1)}`);
        res.push(`${smallIndent}+ ${getLine(key, value2)}`);
      }
    } else if (
      value1 &&
      typeof value1 === 'object' &&
      value2 &&
      typeof value2 === 'object'
    ) {
      res.push(`${indent}${key}: ${compareFiles(value1, value2, depth + 1)}${indent}}\n`);
    } else if (!value1) {
      res.push(`${smallIndent}+ ${key}: ${compareFiles(value2, value2, depth + 1)}${indent}}\n`);
    } else if (!value2) {
      res.push(`${smallIndent}- ${key}: ${compareFiles(value1, value1, depth + 1)}${indent}}\n`);
    } else if (_.isObject(value1)) {
      res.push(`${smallIndent}- ${key}: ${compareFiles(value1, value1, depth + 1)}${indent}}\n`);
      res.push(`${smallIndent}+ ${getLine(key, value2)}`);
    } else if (_.isObject(value2)) {
      res.push(`${smallIndent}- ${getLine(key, value1)}`);
      res.push(`${smallIndent}+ ${key}: ${compareFiles(value2, value2, depth + 1)}${indent}}\n`);
    }
  });

  console.log(res);

  return `{\n${res.join('')}`;
};

export const readAndCompareFiles = (filepath1, filepath2) => {
  const file1 = readAndParseFile(filepath1);
  const file2 = readAndParseFile(filepath2);
  const result = compareFiles(file1, file2);

  return `${result}}`;
};
