export const configuredStyles = {
  border: '1px solid #728099',
  display: 'flex',
  margin: '0 auto',
  boxShadow: 'rgba(0,0,0,0.2) 0px 0px 60px 12px',
};

export const defaultViewport = 'default';
export const resetViewport = {
  name: 'Reset',
  styles: {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
    margin: '0',
    boxShadow: 'none',
  },
};

export const viewports = {
  iphone5: {
    name: 'iPhone 5',
    styles: {
      height: '568px',
      width: '320px',
      ...configuredStyles,
    },
  },
  iphone6: {
    name: 'iPhone 6',
    styles: {
      height: '667px',
      width: '375px',
      ...configuredStyles,
    },
  },
  iphone6p: {
    name: 'iPhone 6 Plus',
    styles: {
      height: '736px',
      width: '414px',
      ...configuredStyles,
    },
  },
  ipad: {
    name: 'iPad',
    styles: {
      height: '1024px',
      width: '768px',
      ...configuredStyles,
    },
  },
  galaxys5: {
    name: 'Galaxy S5',
    styles: {
      height: '640px',
      width: '360px',
      ...configuredStyles,
    },
  },
  nexus5x: {
    name: 'Nexus 5X',
    styles: {
      height: '660px',
      width: '412px',
      ...configuredStyles,
    },
  },
  nexus6p: {
    name: 'Nexus 6P',
    styles: {
      height: '732px',
      width: '412px',
      ...configuredStyles,
    },
  },
};
