import { getStorybookUI, configure } from '@storybook/react-native';
import './rn-addons';

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
