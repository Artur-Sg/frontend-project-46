#!/usr/bin/env node

import { Command } from 'commander';
import { readAndParseFile, compareFiles } from './src/utils.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const json1 = readAndParseFile(filepath1);
    const json2 = readAndParseFile(filepath2);
    const result = compareFiles(json1, json2);

    return result;
  });

program.parse();
