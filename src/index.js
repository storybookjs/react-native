import React from 'react';
import PropEditor from './components/PropEditor';

export function addWithKnobs(storyName, storyFn) {
  this.add(storyName, (context) => (
    <PropEditor storyFn={storyFn} context={context} />
  ));
}
