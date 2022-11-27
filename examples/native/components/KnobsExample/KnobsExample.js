import React from 'react';
import { View, Text } from 'react-native';

export default ({
  backgroundColor,
  name,
  age,
  fruit,
  otherFruit,
  birthday,
  dollars,
  items,
  nice,
  customStyles,
}) => {
  const intro = `My name is ${name}, I'm ${age} years old, and my favorite fruit is ${fruit}. I also enjoy ${otherFruit}.`;
  const style = { backgroundColor, ...customStyles };
  const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <View style={style}>
      <Text>{intro}</Text>
      <Text>My birthday is: {new Date(birthday).toLocaleDateString('en-US', dateOptions)}</Text>
      <Text>My wallet contains: ${dollars.toFixed(2)}</Text>
      <Text>In my backpack, I have:</Text>
      <View>
        {items.map((item) => (
          <Text key={item}>{item}</Text>
        ))}
      </View>
      <Text>{salutation}</Text>
    </View>
  );
};
