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
  loginButton: {
    ...button,
    fontWeight: 'bold',
    borderRight: '1px solid rgb(234, 234, 234)',
  },
  submitButton: {
    ...button,
    borderLeft: '1px solid rgb(234, 234, 234)',
  },
  input: {
    flex: 1,
    boxSizing: 'border-box',
    height: 30,
    border: 'none',
    outline: 'none',
    padding: '9px 11px',
    fontSize: 13,
    lineHeight: 1.7,
    color: 'rgba(0, 0, 0, 0.8)',
    fontFamily: 'sans-serif',
  },
}
