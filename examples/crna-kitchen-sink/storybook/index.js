import { getStorybookUI, configure, addDecorator, addParameters } from '@storybook/react-native';
import './rn-addons';
import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

addDecorator(withBackgrounds);

addParameters({
  backgrounds: [
    { name: 'dark', value: '#222222' },
    { name: 'white', value: '#ffffff', default: true },
  ],
});

configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

// const darkTheme = {
//   backgroundColor: 'black',
//   headerTextColor: 'white',
//   labelColor: 'white',
//   borderColor: 'white',
//   previewBorderColor: 'gray',
//   buttonTextColor: 'white',
//   buttonActiveTextColor: 'white',
// };

// const StorybookUIRoot = getStorybookUI({ theme: darkTheme });

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});
export default StorybookUIRoot;
