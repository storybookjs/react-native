const configuredStyles = {
  border: '1px solid #728099',
  display: 'flex',
  margin: '0 auto',
  boxShadow: 'rgba(0,0,0,0.2) 0px 0px 60px 12px',
};

export const viewports = {
  iphone6: {
    name: 'iPhone 6',
    styles: {
      height: '667px',
      width: '375px',
      ...configuredStyles,
    },
  },
  reset: {
    name: 'Reset',
    styles: {
      width: '100%',
      height: '100%',
      border: 'none',
      display: 'block',
      margin: '0',
      boxShadow: 'none',
    },
  },
};
