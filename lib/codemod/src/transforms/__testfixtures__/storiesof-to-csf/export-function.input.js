/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';

import ComponentItem from './ComponentItem';
import {
  componentRepresentations as imageComponentRepresentations,
  makeSimpleComponentRepresentation as imageMakeSimpleComponentRepresentation,
} from './ComponentRepresentationImage.stories';

function Item({ ...props }) {
  return (
    <div
      style={{
        display: 'inline-block',
        verticalAlign: 'top',
        width: 230,
        outline: '1px dotted red',
        margin: '7.5px',
      }}
    >
      <ComponentItem {...props} />
    </div>
  );
}

// eslint-disable-next-line import/prefer-default-export
export const componentRepresentations = Object.entries(imageComponentRepresentations).reduce(
  (acc, [key, componentRepresentation]) => ({
    ...acc,
    [key]: {
      ...componentRepresentation,
      webPath: '/component',
      specCount: 3,
    },
  }),
  {}
);

export function makeSimpleComponentRepresentation({}) {
  return 5;
}

storiesOf('Webapp components/ComponentItem', module)
  .addDecorator(storyFn => <div style={{ margin: '1rem' }}>{storyFn()}</div>)
  .add('loading', () => <Item loading />)
  .add('in progress', () => <Item componentRepresentation={componentRepresentations.inProgress} />);
