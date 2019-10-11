#!/usr/bin/env node

/* eslint-disable global-require */

const { spawn } = require('child_process');
const { promisify } = require('util');
const {
  readdir: readdirRaw,
  readFile: readFileRaw,
  writeFile: writeFileRaw,
  statSync,
  cop,
} = require('fs');
const { join } = require('path');

const readdir = promisify(readdirRaw);
const readFile = promisify(readFileRaw);
const writeFile = promisify(writeFileRaw);

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
    const to = p(['built-storybooks', target, d]);
    const from = p(['built-storybooks', d]);

    await copy(from, to, {
      overwrite: true,
    });
  }, Promise.resolve());

  logger.log('-------');
  logger.log('✅ done');
  logger.log('-------');
  logger.log('');

  logger.log(`📑 creating index`);

  const indexLocation = p(['built-storybooks', 'index.html']);
  const indexContent = `
    <style>
      body {
        background: black;
        color: white;
      }
      #frame {
        position: absolute;
        left: 0;
        right: 0;
        width: 100vw;
        height: calc(100vh - 30px);
        bottom: 0;
        top: 30px;
        border: 0 none;
        margin: 0;
        padding: 0;
      }
      #select {
        position: absolute;
        top: 0;
        right: 100px;
        left: 10px;
        height: 30px;
        width: calc(100vw - 120px);
        background: black;
        color: white;
        border: 0 none;
        border-radius: 0;
        padding: 10px;
        box-sizing: border-box;
      }
      #open {
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 30px;
        background: black;
        color: white;
        border: 0 none;
        border-radius: 0;
        padding: 10px;
        box-sizing: border-box;
      }
    </style>

    <script>
      function handleClick() {
        var value = document.getElementById("select").value;
        window.location = document.location.origin + value;
      }
      function handleSelect() {
        var value = document.getElementById("select").value;
        var frame = document.getElementById("frame");

        sessionStorage.clear();
        localStorage.clear();

        frame.setAttribute('src', value);
      }
    </script>

    <button id="open" onclick="handleClick()">open</button>

    <select id="select" onchange="handleSelect()">
      ${deployables.map(i => `<option value="/${i}/">${i}</option>`).join('\n')}
    </select>

    <iframe id="frame" src="/${deployables[0]}/" />
  `;

  await writeFile(indexLocation, indexContent);

  logger.log('-------');
  logger.log('✅ done');
  logger.log('-------');
};

const run = async () => {
  await exec('yarn', ['bootstrap', '--core']);

  const examples = await readdir(p(['examples']));

  await handleExamples(examples);
};

run();
