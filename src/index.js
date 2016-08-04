import React from 'react';
import Panel from './components/Panel';
import addons from '@kadira/storybook-addons';
import Wrap from './components/Wrap';

const initialFields = {};
const fields = {};

export function register() {
  addons.register('kadirahq/storybook-addon-knobs', () => {
    const channel = addons.getChannel();

    const onChange = ({ name, value }) => {
      let _value = value;
      if (fields[name].type === 'object') {
        try {
          _value = eval(`(${value})`); // eslint-disable-line no-eval
        } catch (e) {
          return;
        }
      }
      fields[name].value = _value;
    };

    addons.addPanel('kadirahq/storybook-addon-knobs', {
      title: 'Knobs',
      render: () => (
        <Panel
          channel={channel}
          initialFields={initialFields}
          onChange={onChange}
        />
      ),
    });
  });
}

export function createKnob(name, value, type) {
  if (fields[name]) {
    return fields[name].value;
  }

  fields[name] = { name, value, type };

  let formatedValue = value;
  if (type === 'object') {
    formatedValue = JSON.stringify(value);
  }

  initialFields[name] = { name, value: formatedValue, type };

  return value;
}

export function wrap(storyFn) {
  const channel = addons.getChannel();

  return (context) => (
    <Wrap context={context} storyFn={storyFn} channel={channel} />
  );
}
