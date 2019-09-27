import { configure } from '@storybook/react';

// The simplest version of examples would just export this function for users to use
function importAll(context) {
  context.keys().forEach(filename => context(filename));
}

function loadStories() {
  importAll(require.context('./stories', true, /\.js$/));
}

configure(loadStories, module);
