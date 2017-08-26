import glamorous from 'glamorous';
import RoutedLink from './routed_link';

export default glamorous(RoutedLink, { rootEl: 'a' })(
  {
    display: 'block',
    color: '#828282',
    textDecoration: 'none',
    fontSize: '13px',
    lineHeight: '16px',
    padding: '1px 5px 4px',
    marginLeft: '5px',
    position: 'relative',
    zIndex: 1,
  },
  ({ active }) =>
    active && {
      color: 'inherit',
      fontWeight: 'bold',
      backgroundColor: '#EEE',
      zIndex: 0,
    }
);
