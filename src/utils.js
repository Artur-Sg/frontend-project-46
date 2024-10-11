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
