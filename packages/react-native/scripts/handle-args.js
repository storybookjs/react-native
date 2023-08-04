function getArguments() {
  const { program } = require('commander');

  program
    .description('Getter and watcher for react native storybook')
    .option(
      '-c, --config-path <path>',
      'The path to your config folder relative to your project-dir',
      './.storybook'
    )
    .option('-a, --absolute', 'Use absolute paths for story imports')
    .option(
      '-unstable_useRequireContext, --unstable_useRequireContext',
      'Use experimental require.context to load stories'
    );

  program.parse();

  return program.opts();
}

module.exports = { getArguments };
