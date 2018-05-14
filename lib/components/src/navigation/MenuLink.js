import PropTypes from 'prop-types';
import styled from 'react-emotion';
import RoutedLink from './RoutedLink';

const MenuLink = styled(RoutedLink, { rootEl: 'a' })(
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
    active
      ? {
          color: 'inherit',
          fontWeight: 'bold',
          backgroundColor: 'rgba(0,0,0,0.07)',
          zIndex: 0,
        }
      : {}
);
MenuLink.propTypes = {
  active: PropTypes.bool,
};

export default MenuLink;
