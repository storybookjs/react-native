#!/usr/bin/env node

import program from 'commander';

program.option('-o, --outdir <outdir>', 'location to store built storybook').parse(process.argv);
