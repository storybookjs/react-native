const button = {
  boxSizing: 'border-box',
  height: 30,
  border: 'none',
  outline: 'none',
  background: '#fafafa',
  padding: '7px 15px',
  fontSize: 12,
  lineHeight: 1,
  color: 'rgba(0, 0, 0, 0.5)',
};

export default {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid rgb(234, 234, 234)',
  },
  submitButton: {
    ...button,
    cursor: 'pointer',
    borderRadius: '0 0 4px 0',
  },
  input: {
    flex: 1,
    boxSizing: 'border-box',
    height: 30,
    maxHeight: 70,
    border: 'none',
    borderRadius: '0 0 0 4px',
    outline: 'none',
    padding: '5px 10px',
    fontSize: 13,
    lineHeight: 1.6,
    color: 'rgba(0, 0, 0, 0.8)',
    fontFamily: 'sans-serif',
    resize: 'none',
  },
};
