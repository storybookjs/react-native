function getArguments() {
  const { program } = require('commander');

  program
    .description('Getter and watcher for react native storybook')
    .option(
      '-c, --config-path <path>',
      'The path to your config folder relative to your project-dir',
      './.storybook'
    )
    .option('-js, --use-js', 'Use a js file for storybook.requires')
    .option('-a, --absolute', 'Use absolute paths for story imports')
    .option('-v6, --v6-store', 'Use v6 store, for storiesof compatibility')
    .option(
      '-rc, --v6-require-context',
      'When using v6 store should use require.context to load stories'
    );

  program.parse();

  return program.opts();
}

module.exports = { getArguments };
