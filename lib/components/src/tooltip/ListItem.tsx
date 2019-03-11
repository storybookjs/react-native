import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import memoize from 'memoizerific';
import { transparentize } from 'polished';

const Title = styled.span(
  ({ theme }: any) => ({
    color: theme.color.defaultText,
    fontWeight: theme.typography.weight.normal,
  }),
  ({ active, theme }: any) =>
    active
      ? {
          color: theme.color.primary,
          fontWeight: theme.typography.weight.bold,
        }
      : {},
  ({ loading, theme }: any) =>
    loading
      ? {
          display: 'inline-block',
          flex: 'none',
          ...theme.animation.inlineGlow,
        }
      : {},
  ({ disabled, theme }: any) =>
    disabled
      ? {
          color: transparentize(0.7, theme.color.defaultText),
        }
      : {}
);

const Right = styled.span(
  {
    '& svg': {
      transition: 'all 200ms ease-out',
      opacity: '0',
      height: '12px',
      width: '12px',
      margin: '3px 0',
      verticalAlign: 'top',
    } as any,
    '& path': {
      fill: 'inherit',
    },
  },
  ({ active, theme }: any) =>
    active
      ? {
          '& svg': {
            opacity: 1,
          },
          '& path': {
            fill: theme.color.primary,
          },
        }
      : {}
);

const Center = styled.span({
  flex: 1,
  textAlign: 'left',
  display: 'inline-flex',

  '& > * + *': {
    paddingLeft: 10,
  },
});

const CenterText = styled.span(
  {
    flex: 1,
    textAlign: 'center',
  },
  ({ active, theme }: any) =>
    active
      ? {
          color: theme.color.primary,
        }
      : {},
  ({ theme, disabled }: any) =>
    disabled
      ? {
          color: theme.color.mediumdark,
        }
      : {}
);

const Left = styled.span(({ active, theme }: any) =>
  active
    ? {
        '& svg': {
          opacity: 1,
        },
        '& path': {
          fill: theme.color.primary,
        },
      }
    : {}
);

const Item = styled.a(
  ({ theme }) => ({
    fontSize: theme.typography.size.s1,
    transition: 'all 150ms ease-out',
    color: transparentize(0.5, theme.color.defaultText),
    textDecoration: 'none',
    cursor: 'pointer',
    justifyContent: 'space-between',

    lineHeight: '18px',
    padding: '7px 15px',
    display: 'flex',
    alignItems: 'center',

    '& > * + *': {
      paddingLeft: 10,
    },

    '&:hover': {
      background: theme.background.hoverable,
    },
    '&:hover svg': {
      opacity: 1,
    },
  }),
  ({ disabled }: any) =>
    disabled
      ? {
          cursor: 'not-allowed',
        }
      : {}
);

const getItemProps = memoize(100)((onClick, href, LinkWrapper) => {
  const result = {};

  if (onClick) {
    Object.assign(result, {
      onClick,
    });
  }
  if (href) {
    Object.assign(result, {
      href,
    });
  }
  if (LinkWrapper && href) {
    Object.assign(result, {
      to: href,
      as: LinkWrapper,
    });
  }
  return result;
});

export default function ListItem({
  loading,
  left,
  title,
  center,
  right,
  active,
  disabled,
  href,
  onClick,
  LinkWrapper,
  ...rest
}: any) {
  const itemProps = getItemProps(onClick, href, LinkWrapper);
  const commonProps = { active, disabled, loading };

  return (
    <Item {...commonProps} {...rest} {...itemProps}>
      {left && <Left {...commonProps}>{left}</Left>}
      {title || center ? (
        <Center>
          {title && <Title {...commonProps}>{title}</Title>}
          {center && <CenterText {...commonProps}>{center}</CenterText>}
        </Center>
      ) : null}
      {right && <Right {...commonProps}>{right}</Right>}
    </Item>
  );
}

ListItem.propTypes = {
  loading: PropTypes.bool,
  left: PropTypes.node,
  title: PropTypes.node,
  center: PropTypes.node,
  right: PropTypes.node,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
  LinkWrapper: PropTypes.func,
  onClick: PropTypes.func,
};

ListItem.defaultProps = {
  loading: false,
  left: null,
  title: <span>Loading state</span>,
  center: null,
  right: null,
  active: false,
  disabled: false,
  href: null,
  LinkWrapper: null,
  onClick: null,
};
