import glamorous from 'glamorous';

export default glamorous.button({
  outline: 'none',
  overflow: 'hidden',
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 13,
  padding: '3px 10px',

  ':hover': {
    backgroundColor: '#f4f7fa',
    borderColor: '#ddd',
  },

  ':active': {
    backgroundColor: '#e9ecef',
    borderColor: '#ccc',
  },
});
