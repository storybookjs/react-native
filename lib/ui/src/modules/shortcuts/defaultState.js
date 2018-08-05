import checkIfMobileDevice from '../ui/libs/is_mobile_device';

const { userAgent } = global.window.navigator;
const isMobileDevice = checkIfMobileDevice(userAgent);

export default {
  isMobileDevice,
  shortcutOptions: {
    goFullScreen: false,
    showStoriesPanel: !isMobileDevice,
    showAddonPanel: true,
    showSearchBox: false,
    addonPanelInRight: false,
    enableShortcuts: true,
  },
};
