import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import Button from 'rax-button';
import Text from 'rax-text';

const stories = storiesOf('Addon|addon-knobs', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

// Knobs for Rax props
stories.add('with a button', () => {
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
});

// Knobs as dynamic variables.
stories.add('as dynamic variables', () => {
  const name = text('Name', 'Benjamin Button');
  const age = number('Age', 89);

  const content = `I am ${name} and I'm ${age} years old.`;
  return <Text>{content}</Text>;
});
