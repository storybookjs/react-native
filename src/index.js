import React from 'react';
import PropEditor from './components/PropEditor';

export function addWithKnobs(storyName, storyFn) {
  const initialValues = {};

  const recordInitialValues = (name, initial, type) => {
    let value = initial;
    if (type === 'object') {
      value = JSON.stringify(value, null, 4);
    }

    initialValues[name] = {
      name,
      value,
      type,
      valid: true,
    };

    return initial;
  };

  // Call storyFn once to get the initial values. Just ignore the result of
  // this call.
  const dummyContext = {}; // TODO: Find if this object needs some fields inside
  storyFn(dummyContext, recordInitialValues);

  this.add(storyName, (context) => (
    <PropEditor storyFn={storyFn} context={context} initialValues={initialValues} />
  ));
}
