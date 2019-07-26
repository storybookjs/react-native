import { createElement } from 'rax';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import Button from 'rax-button';
import Text from 'rax-text';

export default {
  title: 'Addon|addon-knobs',
  decorators: [withKnobs],
};

export const withAButton = () => {
  const disabled = boolean('Disabled', false);
  const hasStyle = boolean('Has Style', false);
  const style = hasStyle
    ? {
        border: '1px solid #d2d2d2',
        width: 200,
        paddingLeft: 10,
        paddingRight: 10,
      }
    : null;
  const textStyle = hasStyle
    ? {
        color: disabled ? '#666' : '#00f',
        fontSize: 16,
      }
    : {
        color: disabled ? '#666' : '#000',
      };
  return (
    <Button style={style} disabled={disabled}>
      <Text style={textStyle}>{text('Label', 'Hello Storybook')}</Text>
    </Button>
  );
};

withAButton.story = {
  name: 'with a button',
};

export const asDynamicVariables = () => {
  const name = text('Name', 'Benjamin Button');
  const age = number('Age', 89);

  const content = `I am ${name} and I'm ${age} years old.`;
  return <Text>{content}</Text>;
};

asDynamicVariables.story = {
  name: 'as dynamic variables',
};
