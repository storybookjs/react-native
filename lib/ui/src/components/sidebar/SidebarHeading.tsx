import React from 'react';
import { styled, withTheme } from '@storybook/theming';
import { StorybookLogo, WithTooltip, TooltipLinkList, Button, Icons } from '@storybook/components';

export type BrandAreaProps = React.ComponentProps<'div'>;

const BrandArea = styled.div<BrandAreaProps>(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  fontWeight: theme.typography.weight.bold,
  marginRight: theme.layoutMargin,
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  paddingTop: 3,
  paddingBottom: 3,
  minHeight: 28,
  '& > *': {
    maxWidth: '100%',
    height: 'auto',
    width: 'auto',
    display: 'block',
  },
}));

const Logo = styled(StorybookLogo)({
  width: 'auto',
  height: 22,
  display: 'block',
});

const Img = styled.img({
  width: 'auto',
  height: 'auto',
  display: 'block',
  maxWidth: '100%',
});

const LogoLink = styled.a({
  display: 'block',
  width: '100%',
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
});

export type MenuButtonProps = React.ComponentProps<typeof Button> &
  // FIXME: Button should extends from the native <button>
  React.ComponentProps<'button'> & {
    highlighted: boolean;
  };

const MenuButton = styled(Button)<MenuButtonProps>(props => ({
  position: 'relative',
  overflow: 'visible',
  padding: 7,

  ...(props.highlighted && {
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 8,
      background: `${props.theme.color.positive}`,
    },
  }),
}));

const Head = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

const Brand = withTheme(({ theme: { brand: { title = 'Storybook', url = './', image } } }) => {
  const targetValue = url === './' ? '' : '_blank';
  if (image === undefined && url === null) {
    return <Logo alt={title} />;
  }
  if (image === undefined && url) {
    return (
      <LogoLink href={url} target={targetValue}>
        <Logo alt={title} />
      </LogoLink>
    );
  }
  if (image === null && url === null) {
    return title;
  }
  if (image === null && url) {
    return <LogoLink href={url} target={targetValue} dangerouslySetInnerHTML={{ __html: title }} />;
  }
  if (image && url === null) {
    return <Img src={image} alt={title} />;
  }
  if (image && url) {
    return (
      <LogoLink href={url} target={targetValue}>
        <Img src={image} alt={title} />
      </LogoLink>
    );
  }
  return null;
});

export interface SidebarHeadingProps {
  menuHighlighted?: boolean;
  menu: React.ComponentProps<typeof TooltipLinkList>['links'];
  className?: string;
}

const SidebarHeading = ({ menuHighlighted = false, menu, ...props }: SidebarHeadingProps) => (
  <Head {...props}>
    <BrandArea>
      <Brand />
    </BrandArea>

    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }) => (
        <TooltipLinkList
          // @ts-ignore // FIXME: onCLick/onHide should pass React synthetic event down to avoid surprise
          links={menu.map(({ onClick, ...rest }) => ({
            ...rest,
            onClick: (e: React.MouseEvent) => {
              if (onClick) {
                // @ts-ignore
                onClick(e);
              }
              // @ts-ignore
              onHide(e);
            },
          }))}
        />
      )}
      closeOnClick
    >
      <MenuButton outline small containsIcon highlighted={menuHighlighted} title="Shortcuts">
        <Icons icon="ellipsis" />
      </MenuButton>
    </WithTooltip>
  </Head>
);

export default SidebarHeading;
