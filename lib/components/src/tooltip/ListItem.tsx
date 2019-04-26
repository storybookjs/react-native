import React, { FunctionComponent, ReactNode } from 'react';
import { styled } from '@storybook/theming';
import memoize from 'memoizerific';
import { transparentize } from 'polished';

interface TitleProps {
  active?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const Title = styled.span<TitleProps>(
  ({ theme }) => ({
    color: theme.color.defaultText,
    // Previously was theme.typography.weight.normal but this weight does not exists in Theme
    fontWeight: theme.typography.weight.regular,
  }),
  ({ active, theme }) =>
    active
      ? {
          color: theme.color.primary,
          fontWeight: theme.typography.weight.bold,
        }
      : {},
  ({ loading, theme }) =>
    loading
      ? {
          display: 'inline-block',
          flex: 'none',
          ...theme.animation.inlineGlow,
        }
      : {},
  ({ disabled, theme }) =>
    disabled
      ? {
          color: transparentize(0.7, theme.color.defaultText),
        }
      : {}
);

interface RightProps {
  active?: boolean;
}

const Right = styled.span<RightProps>(
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
  ({ active, theme }) =>
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

interface CenterTextProps {
  active?: boolean;
  disabled?: boolean;
}

const CenterText = styled.span<CenterTextProps>(
  {
    flex: 1,
    textAlign: 'center',
  },
  ({ active, theme }) =>
    active
      ? {
          color: theme.color.primary,
        }
      : {},
  ({ theme, disabled }) =>
    disabled
      ? {
          color: theme.color.mediumdark,
        }
      : {}
);

interface LeftProps {
  active?: boolean;
}

const Left = styled.span<LeftProps>(({ active, theme }) =>
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

interface ItemProps {
  disabled?: boolean;
}

const Item = styled.a<ItemProps>(
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
  ({ disabled }) =>
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

export type LinkWrapperType = FunctionComponent;

export interface ListItemProps {
  loading?: boolean;
  left?: ReactNode;
  title?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  href?: string | object;
  LinkWrapper?: LinkWrapperType;
  onClick?: () => void;
}

const ListItem: FunctionComponent<ListItemProps> = ({
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
}) => {
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

export default ListItem;
