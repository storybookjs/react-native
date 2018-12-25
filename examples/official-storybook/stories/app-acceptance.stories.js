import React from 'react';
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';

// For these stories to work, you must build the static version of the
//   example storybooks *before* running this storybook.

const chapter = storiesOf('App|acceptance', module);

const style = {
  border: 0,
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
};

[
  'cra-kitchen-sink',
  'vue-kitchen-sink',
  'svelte-kitchen-sink',
  'angular-cli',
  'polymer-cli',
  'mithril-kitchen-sink',
  'html-kitchen-sink',
  'riot-kitchen-sink',
  'preact-kitchen-sink',
].forEach(name => {
  chapter.add(
    name,
    withNotes(`You must build the storybook for the ${name} example for this story to work.`)(
      () => <iframe style={style} title={name} src={`${name}/index.html`} />
    )
  );
});
