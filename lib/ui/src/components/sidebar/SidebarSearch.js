import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { withState } from 'recompose';

const FilterField = styled.input(({ theme }) => ({
  height: 30,
  boxSizing: 'border-box',
  width: '100%',
  background: 'transparent',
  border: '0 none',
  color: theme.mainTextColor,
  padding: theme.layoutMargin,
  paddingLeft: 0,
  outline: 0,
}));
const FilterForm = styled.form(({ theme, focussed }) => ({
  borderBottom: focussed ? `1px solid transparent` : '1px solid transparent',
  borderBottomColor: focussed ? theme.color.secondary : theme.mainBorderColor,
  outline: 0,
}));

export const PureSidebarSearch = ({ focussed, onSetFocussed, className, ...props }) => (
  <FilterForm autoComplete="off" focussed={focussed} className={className}>
    <FilterField
      autocomplete="off"
      id="storybook-explorer-searchfield"
      onFocus={() => onSetFocussed(true)}
      onBlur={() => onSetFocussed(false)}
      {...props}
      placeholder={focussed ? 'Type to search...' : 'Press "/" to search...'}
    />
  </FilterForm>
);

PureSidebarSearch.propTypes = {
  focussed: PropTypes.bool.isRequired,
  onSetFocussed: PropTypes.func.isRequired,
  className: PropTypes.string,
};

PureSidebarSearch.defaultProps = {
  className: null,
};

export default withState('focussed', 'onSetFocussed', false)(PureSidebarSearch);
