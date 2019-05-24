const styles = {
  style: {
    position: 'fixed',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    overflow: 'auto',
  },
  innerStyle: {
    margin: 'auto',
    maxHeight: '100%', // Hack for centering correctly in IE11
  },
} as const;

export default styles;
