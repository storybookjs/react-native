import React from 'react';
import { View, Text } from 'react-native';

import { text, number, boolean, color, select, array, date, object } from '@storybook/addon-knobs';

export default () => {
  const name = text('Name', 'Storyteller');
  const age = number('Age', 70, { range: true, min: 0, max: 90, step: 5 });
  const fruits = {
    apple: 'Apple',
    banana: 'Banana',
    cherry: 'Cherry',
  };
  const fruit = select('Fruit', fruits, 'apple');
  const dollars = number('Dollars', 12.5);

  // NOTE: color picker is currently broken
  const backgroundColor = color('background', '#ffff00');
  const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
  const otherStyles = object('Styles', {
    borderWidth: 3,
    borderColor: '#ff00ff',
    padding: 10,
  });
  const nice = boolean('Nice', true);

  // NOTE: put this last because it currently breaks everything after it :D
  const birthday = date('Birthday', new Date('Jan 20 2017'));

  const intro = `My name is ${name}, I'm ${age} years old, and my favorite fruit is ${fruit}.`;
  const style = { backgroundColor, ...otherStyles };
  const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  return (
    <View style={style}>
      <Text>
        {intro}
      </Text>
      <Text>
        My birthday is: {new Date(birthday).toLocaleDateString('en-US', dateOptions)}
      </Text>
      <Text>
        My wallet contains: ${dollars.toFixed(2)}
      </Text>
      <Text>In my backpack, I have:</Text>
      <View>
        {items.map(item =>
          <Text key={item}>
            {item}
          </Text>
        )}
      </View>
      <Text>
        {salutation}
      </Text>
    </View>
  );
};
