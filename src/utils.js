import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import _ from 'lodash';

const readFile = (filepath) => readFileSync(filepath, 'utf-8');

const parseFile = (filepath) => {
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

const readAndParseFile = (filepath) => {
  const data = readFile(filepath);
  const parser = parseFile(filepath);

  return parser(data);
};

const getLine = (key, value) => `${key}: ${value}`;

const getSign = (value) => (value !== undefined ? '-' : '+');

const compareFiles = (file1, file2, depth = 1) => {
  const res = [];
  const keys = new Set([...Object.keys(file1), ...Object.keys(file2)].sort());
  const indent = ' '.repeat(4 * depth);
  const smallIndent = ' '.repeat(4 * depth - 2);

  const addObjectDiffLine = (currIndent, sign, key, values, currDepth = 1) => {
    const nextIndent = ' '.repeat(4 * currDepth);
    const addition = `${currIndent}${sign}${sign ? ' ' : ''}`;
    const value = `${key}: {\n${compareFiles(
      values[0],
      values[1],
      currDepth + 1,
    )}\n${nextIndent}}`;

    res.push(`${addition}${value}`);
  };

  const addDiffLine = (currIndent, sign, key, values) => {
    const addition = `${currIndent}${sign}${sign ? ' ' : ''}`;
    const value = `${getLine(key, values[0])}`;

    res.push(`${addition}${value}`);
  };

  keys.forEach((key) => {
    const [value1, value2] = [file1[key], file2[key]];
    const values = value1 ? [value1, value1] : [value2, value2];

    if (!_.isObject(value1) && !_.isObject(value2)) {
      if (value1 === value2) {
        addDiffLine(indent, '', key, [value1, value2]);
      } else if (value1 === undefined || value2 === undefined) {
        addDiffLine(smallIndent, getSign(value1), key, values);
      } else {
        addDiffLine(smallIndent, '-', key, [value1, value1]);
        addDiffLine(smallIndent, '+', key, [value2, value2]);
      }
    } else if (_.isObject(value1) && _.isObject(value2)) {
      addObjectDiffLine(indent, '', key, [value1, value2], depth);
    } else if (value1 === undefined || value2 === undefined) {
      addObjectDiffLine(smallIndent, getSign(value1), key, values, depth);
    } else if (_.isObject(value1)) {
      addObjectDiffLine(smallIndent, '-', key, [value1, value1], depth);
      addDiffLine(smallIndent, '+', key, [value2, value2]);
    } else if (_.isObject(value2)) {
      addDiffLine(smallIndent, '-', key, [value1, value1]);
      addObjectDiffLine(smallIndent, '+', key, [value2, value2], depth);
    }
  });

  return res.join('\n');
};

const readAndCompareFiles = (filepath1, filepath2) => {
  const file1 = readAndParseFile(filepath1);
  const file2 = readAndParseFile(filepath2);
  const result = compareFiles(file1, file2);

  return `{\n${result}\n}`;
};

export default readAndCompareFiles;
