const styles = {
  style: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex' as const,
    alignItems: 'center' as const,
    overflow: 'auto' as const,
  },
  innerStyle: {
    margin: 'auto' as const,
    maxHeight: '100%' as const, // Hack for centering correctly in IE11
    overflow: 'auto' as const,
  },
};

export default styles;
