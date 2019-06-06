import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { linkTo } from '@storybook/addon-links';
import Picker from 'rax-picker';
import Welcome from '../components/Welcome';

storiesOf('Addon|addon-links', module)
  .add('Link to notes', () => {
    return (
      <Picker onValueChange={linkTo('Addon|addon-notes', value => value)}>
        <Picker.Item label="Choose story in Addon|addon-notes" />
        <Picker.Item value="basic" label="basic" />
        <Picker.Item value="with emojies" label="with emojies" />
        <Picker.Item value="with markdown" label="with markdown" />
      </Picker>
    );
  })
  .add('Welcome screen with link to Basic > Button', () => (
    <Welcome showApp={linkTo('Basic', 'Button')} />
  ));
