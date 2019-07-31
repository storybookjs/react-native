import React, { useState } from 'react';
import { styled } from '@storybook/theming';
import { opacify } from 'polished';
import { Icons } from '@storybook/components';

export type FilterFieldProps = React.ComponentProps<'input'>;

const FilterField = styled.input<FilterFieldProps>(({ theme }) => ({
  // resets
  appearance: 'none',
  border: 'none',
  boxSizing: 'inherit',
  display: ' block',
  outline: 'none',
  width: ' 100%',
  margin: ' 0',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',

  '&:-webkit-autofill': { WebkitBoxShadow: `0 0 0 3em ${theme.color.lightest} inset` },

  '::placeholder': {
    color: theme.color.mediumdark,
  },

  '&:placeholder-shown ~ button': {
    // hide cancel button using CSS only
    opacity: 0,
  },
}));

export type CancelButtonProps = React.ComponentProps<'button'>;

const CancelButton = styled.button<CancelButtonProps>(({ theme }) => ({
  border: 0,
  margin: 0,
  padding: 4,
  textDecoration: 'none',

  background: theme.appBorderColor,
  borderRadius: '1em',
  cursor: 'pointer',
  opacity: 1,
  transition: 'all 150ms ease-out',

  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: 2,

  '> svg': {
    display: 'block',
    height: 8,
    width: 8,
    color: theme.input.color,
    transition: 'all 150ms ease-out',
  },

  '&:hover': {
    background: opacify(0.1, theme.appBorderColor),
  },
}));

export type FilterFormProps = React.ComponentProps<'form'> & {
  focussed: boolean;
};

const FilterForm = styled.form<FilterFormProps>(
  ({ theme, focussed }) =>
    ({
      transition: 'all 150ms ease-out',
      borderBottom: '1px solid transparent',
      borderBottomColor: focussed
        ? opacify(0.3, theme.appBorderColor)
        : opacify(0.1, theme.appBorderColor),
      outline: 0,
      position: 'relative',

      input: {
        color: theme.input.color,
        fontSize: theme.typography.size.s2 - 1,
        lineHeight: '20px',
        paddingTop: '2px',
        paddingBottom: '2px',
        paddingLeft: '20px',
      },

      '> svg': {
        transition: 'all 150ms ease-out',
        position: 'absolute',
        top: '50%',
        height: '12px',
        width: '12px',
        transform: 'translateY(-50%)',
        zIndex: '1',

        background: 'transparent',

        path: {
          transition: 'all 150ms ease-out',
          fill: 'currentColor',
          opacity: focussed ? 1 : 0.3,
        },
      },
    } as any) // FIXME: emotion have hard time to provide '> svg' typing
);

export type PureSidebarSearchProps = FilterFieldProps & {
  onChange: (arg: string) => void;
};

export const PureSidebarSearch = ({ className, onChange, ...props }: PureSidebarSearchProps) => {
  const [focussed, onSetFocussed] = useState(false);
  return (
    <FilterForm
      autoComplete="off"
      focussed={focussed}
      className={className}
      onReset={() => onChange('')}
    >
      <FilterField
        type="text"
        id="storybook-explorer-searchfield"
        onFocus={() => onSetFocussed(true)}
        onBlur={() => onSetFocussed(false)}
        onChange={e => onChange(e.target.value)}
        {...props}
        placeholder={focussed ? 'Type to search...' : 'Press "/" to search...'}
        aria-label="Search stories"
      />
      <Icons icon="search" />
      <CancelButton type="reset" value="reset" title="Clear search">
        <Icons icon="closeAlt" />
      </CancelButton>
    </FilterForm>
  );
};

export default PureSidebarSearch;
