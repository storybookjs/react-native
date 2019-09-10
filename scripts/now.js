#!/usr/bin/env node

/* eslint-disable global-require */

const { spawn } = require('child_process');
const { promisify } = require('util');
const { readdir: readdirRaw, readFile: readFileRaw, statSync, cop } = require('fs');
const { join } = require('path');

const readdir = promisify(readdirRaw);
const readFile = promisify(readFileRaw);

const p = l => join(__dirname, '..', ...l);
const logger = console;

const exec = async (command, args = [], options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: 'inherit' });

    child.on('close', code => {
      if (code) {
        reject();
      } else {
        resolve();
      }
    });
  });

const hasBuildScript = async l => {
  const text = await readFile(l, 'utf8');
  const json = JSON.parse(text);

  return !!json.scripts['build-storybook'];
};

const handleExamples = async files => {
  const deployables = files.filter(f => {
    const packageJsonLocation = p(['examples', f, 'package.json']);
    const stats = statSync(packageJsonLocation);

    return stats.isFile() && hasBuildScript(packageJsonLocation);
  });

  await deployables.reduce(async (acc, d) => {
    await acc;

    logger.log('');
    logger.log(
      `-----------------${Array(d.length)
        .fill('-')
        .join('')}`
    );
    logger.log(`▶️  building: ${d}`);
    logger.log(
      `-----------------${Array(d.length)
        .fill('-')
        .join('')}`
    );
    const out = p(['built-storybooks', d]);
    const cwd = p(['examples', d]);

    await exec(`yarn`, [`build-storybook`, `--output-dir=${out}`, '--quiet'], { cwd });

    logger.log('-------');
    logger.log('✅ done');
    logger.log('-------');
  }, Promise.resolve());

  const copy = require('recursive-copy');
  const target = 'official-storybook';
  const copyables = deployables.filter(f => f !== target);

  await copyables.reduce(async (acc, d) => {
    await acc;

    logger.log(`💿 copy ${d} to built-storybooks`);
    const to = p(['built-storybooks', target, 'built-storybooks', d]);
    const from = p(['built-storybooks', d]);

    await copy(from, to, {
      overwrite: true,
    });
  }, Promise.resolve());
};

const run = async () => {
  await exec('yarn', ['bootstrap', '--core']);

  const examples = await readdir(p(['examples']));

  await handleExamples(examples);
};

run();
