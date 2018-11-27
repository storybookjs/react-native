import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import RoutedLink from './RoutedLink';

const MenuLink = styled(RoutedLink, { rootEl: 'a' })(
  ({ theme }) => ({
    display: 'block',
    color: theme.dimmedTextColor,
    textDecoration: 'none',
    fontSize: '13px',
    lineHeight: '16px',
    padding: '1px 5px 4px',
    marginLeft: '5px',
    position: 'relative',
    zIndex: 1,
    ...theme.menuLink,
  }),
  ({ theme, active }) =>
    active
      ? {
          color: 'inherit',
          fontWeight: 'bold',
          backgroundColor: 'rgba(0,0,0,0.07)',
          zIndex: 0,
          ...theme.activeMenuLink,
        }
      : {}
);
MenuLink.propTypes = {
  active: PropTypes.bool,
};

export default MenuLink;
