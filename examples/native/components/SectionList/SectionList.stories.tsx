import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StorySectionList } from './StorySectionList';

storiesOf('sections', module).add('section', (p) => {
  console.log(p);
  const items = Array.from({ length: 20 }, (x, i) => {
    return {
      name: i.toString(),
      kind: `${i % 2 === 0 ? 'section-one' : 'section-two'}/${i}`,
    };
  });
  return <StorySectionList storyItems={[...items, { name: 'test', kind: 'kindname' }]} />;
});
