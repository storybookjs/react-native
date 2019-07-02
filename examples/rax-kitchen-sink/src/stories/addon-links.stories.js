import { createElement } from 'rax';
import { linkTo } from '@storybook/addon-links';
import Picker from 'rax-picker';
import Welcome from '../components/Welcome';

export default {
  title: 'Addon|addon-links',
};

export const linkToNotes = () => {
  return (
    <Picker onValueChange={linkTo('Addon|addon-notes', value => value)}>
      <Picker.Item label="Choose story in Addon|addon-notes" />
      <Picker.Item value="basic" label="basic" />
      <Picker.Item value="with emojies" label="with emojies" />
      <Picker.Item value="with markdown" label="with markdown" />
    </Picker>
  );
};

linkToNotes.story = {
  name: 'Link to notes',
};

export const welcomeScreenWithLinkToBasicButton = () => (
  <Welcome showApp={linkTo('Basic', 'Button')} />
);

welcomeScreenWithLinkToBasicButton.story = {
  name: 'Welcome screen with link to Basic > Button',
};
