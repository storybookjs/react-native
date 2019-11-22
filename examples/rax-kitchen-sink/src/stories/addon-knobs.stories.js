import { createElement } from 'rax';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import Text from 'rax-text';

export default {
  title: 'Addon/addon-knobs',
  decorators: [withKnobs],
};

export const WithAButton = () => {
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
    <button style={style} disabled={disabled} type="button">
      <Text style={textStyle}>{text('Label', 'Hello Storybook')}</Text>
    </button>
  );
};

WithAButton.story = {
  name: 'with a button',
};

export const AsDynamicVariables = () => {
  const name = text('Name', 'Benjamin Button');
  const age = number('Age', 89);

  const content = `I am ${name} and I'm ${age} years old.`;
  return <Text>{content}</Text>;
};

AsDynamicVariables.story = {
  name: 'as dynamic variables',
};
