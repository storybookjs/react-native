export const ADDON_ID = 'storybook-addon-viewport';
export const PANEL_ID = `${ADDON_ID}/addon-panel`;
export const UPDATE_VIEWPORT_EVENT_ID = 'addon:viewport:update';
export const CONFIGURE_VIEWPORT_EVENT_ID = 'addon:viewport:configure';
export const INITIAL_VIEWPORTS = {
  responsive: {
    name: 'Responsive',
    styles: {
      width: '100%',
      height: '100%',
      border: 'none',
      display: 'block',
      margin: '0',
      boxShadow: 'none',
    },
  },
  iphone5: {
    name: 'iPhone 5',
    styles: {
      height: '568px',
      width: '320px',
    },
  },
  iphone6: {
    name: 'iPhone 6',
    styles: {
      height: '667px',
      width: '375px',
    },
  },
  iphone6p: {
    name: 'iPhone 6 Plus',
    styles: {
      height: '736px',
      width: '414px',
    },
  },
  ipad: {
    name: 'iPad',
    styles: {
      height: '1024px',
      width: '768px',
    },
  },
  galaxys5: {
    name: 'Galaxy S5',
    styles: {
      height: '640px',
      width: '360px',
    },
  },
  nexus5x: {
    name: 'Nexus 5X',
    styles: {
      height: '660px',
      width: '412px',
    },
  },
  nexus6p: {
    name: 'Nexus 6P',
    styles: {
      height: '732px',
      width: '412px',
    },
  },
};
export const DEFAULT_VIEWPORT = 'responsive';
