import React from 'react';
import { createKnob, wrap } from '@kadira/storybook-addon-knobs';
import Button from './button';

export default class Preview extends React.Component {
  constructor(props, ...args) {
    super();
  }

  render() {
    return wrap(context => (
      <Button
        color={createKnob('color', '#fff')}
        style={createKnob('style', {width: "100px"}, 'object')}
      >
        {createKnob('children', 'Hi!')}
      </Button>
    ))()
  }
}

