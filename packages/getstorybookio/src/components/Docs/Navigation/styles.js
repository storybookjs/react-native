import theme from '../../theme';

const styles = {
  container: {
    ...theme.base,
    ...theme.text,
    borderRight: '1px solid #ECECEC',
    marginRight: 30,
  },

  h3: {
    color: '#000',
    margin: '25px 0 7px 0',
    padding: 0,
    fontSize: 20,
  },

  ul: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },

  li: {
    margin: '8px 0',
    lineHeight: '25px',
  },

  item: {
    ...theme.text,
    textDecoration: 'none',
  },
};

styles.selectedItem = {
  ...styles.item,
  fontWeight: 600,
};

export default styles;
