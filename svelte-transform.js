const svelte = require('svelte/compiler');

function process(src, filename) {
  const result = svelte.compile(src, {
    format: 'cjs',
    filename,
  });

  const code = result.js ? result.js.code : result.code;

  return {
    code,
    map: result.js ? result.js.map : result.map,
  };
}

exports.process = process;
