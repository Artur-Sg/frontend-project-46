#!/usr/bin/env node

import { Command } from 'commander';
import { readAndCompareFiles } from './src/utils.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    const result = readAndCompareFiles(filepath1, filepath2);

    console.log(result);

    return result;
  });

program.parse();
