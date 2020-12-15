import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StorySectionList } from './StorySectionList';
import { View } from 'react-native';

storiesOf('sections', module)
  .addDecorator((story: any) => (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#eceff1', width: '50%', flex: 1 }}>{story()}</View>
    </View>
  ))
  .add('section', (p) => {
    console.log(p);
    const items = Array.from({ length: 20 }, (x, i) => {
      return {
        name: i.toString(),
        kind: `${i % 2 === 0 ? 'section-one' : 'section-two'}/${i}`,
      };
    });
    return <StorySectionList storyItems={[...items, { name: 'test', kind: 'kindname' }]} />;
  });
