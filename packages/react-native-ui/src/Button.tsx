import { styled, useTheme } from '@storybook/react-native-theming';
import { ReactElement, forwardRef, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { SvgProps } from 'react-native-svg';

export interface ButtonProps extends TouchableOpacityProps {
  asChild?: boolean;
  size?: 'small' | 'medium';
  padding?: 'small' | 'medium';
  variant?: 'outline' | 'solid' | 'ghost';
  disabled?: boolean;
  active?: boolean;
  animation?: 'none' | 'rotate360' | 'glow' | 'jiggle';
  text?: string;
  Icon?: (props: SvgProps) => ReactElement;
}

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      // asChild = false,
      Icon,
      animation = 'none',
      size = 'small',
      variant = 'outline',
      padding = 'medium',
      disabled = false,
      active = false,
      onPress,
      children,
      text,
      ...props
    },
    ref
  ) => {
    // let Comp: 'button' | 'a' | typeof Slot = 'button';
    // if (props.isLink) Comp = 'a';
    // if (asChild) Comp = Slot;
    // let localVariant = variant;
    // let localSize = size;

    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = (event) => {
      if (onPress) onPress(event);
      if (animation === 'none') return;
      setIsAnimating(true);
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        if (isAnimating) setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }, [isAnimating]);

    // Match the old API with the new API.
    // TODO: Remove this after 9.0.
    // if (props.primary) {
    //   localVariant = 'solid';
    //   localSize = 'medium';
    // }

    // Match the old API with the new API.
    // TODO: Remove this after 9.0.
    // if (props.secondary || props.tertiary || props.gray || props.outline || props.inForm) {
    //   localVariant = 'outline';
    //   localSize = 'medium';
    // }

    return (
      <StyledButton
        // as={Comp}
        ref={ref}
        variant={variant}
        size={size}
        padding={padding}
        disabled={disabled}
        active={active}
        animating={isAnimating}
        animation={animation}
        onPress={handleClick}
        {...props}
      >
        {Icon && <ButtonIcon Icon={Icon} variant={variant} active={active} />}
        {text && (
          <ButtonText variant={variant} active={active}>
            {text}
          </ButtonText>
        )}
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

// const StyledButton = styled('TouchableOpacity', {
//   shouldForwardProp: (prop) => isPropValid(prop),
// })<
//   ButtonProps & {
//     animating: boolean;
//     animation: ButtonProps['animation'];
//   }
// >(({ theme, variant, size, disabled, active, animating, animation, padding }) => ({
const StyledButton = styled.TouchableOpacity<
  ButtonProps & { animating: boolean; animation: ButtonProps['animation'] }
>(({ theme, variant, size, disabled, active, /* animating, animation, */ padding }) => ({
  border: 0,
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  flexDirection: 'row',
  gap: 6,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  paddingHorizontal: (() => {
    if (padding === 'small' && size === 'small') return 7;
    if (padding === 'small' && size === 'medium') return 9;
    if (size === 'small') return 10;
    if (size === 'medium') return 12;
    return 0;
  })(),
  paddingVertical: 0,
  height: size === 'small' ? 28 : 32,
  position: 'relative',

  //   textDecoration: 'none',
  transitionProperty: 'background, box-shadow',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-out',
  // verticalAlign: 'top',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  opacity: disabled ? 0.5 : 1,
  margin: 0,

  backgroundColor: (() => {
    if (variant === 'solid') return theme.color.secondary;
    if (variant === 'outline') return theme.button$.background;
    if (variant === 'ghost' && active) return theme.background.hoverable;

    return 'transparent';
  })(),

  boxShadow: variant === 'outline' ? `${theme.button$.border} 0 0 0 1px inset` : 'none',
  borderRadius: theme.input.borderRadius,
  // Making sure that the button never shrinks below its minimum size
  flexShrink: 0,

  //   '&:hover': {
  //     color: variant === 'ghost' ? theme.color.secondary : null,
  //     background: (() => {
  //       let bgColor = theme.color.secondary;
  //       if (variant === 'solid') bgColor = theme.color.secondary;
  //       if (variant === 'outline') bgColor = theme.button.background;

  //       if (variant === 'ghost') return transparentize(0.86, theme.color.secondary);
  //       return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
  //     })(),
  //   },

  //   '&:active': {
  //     color: variant === 'ghost' ? theme.color.secondary : null,
  //     background: (() => {
  //       let bgColor = theme.color.secondary;
  //       if (variant === 'solid') bgColor = theme.color.secondary;
  //       if (variant === 'outline') bgColor = theme.button.background;

  //       if (variant === 'ghost') return theme.background.hoverable;
  //       return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
  //     })(),
  //   },

  //   '&:focus': {
  //     boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
  //     outline: 'none',
  //   },

  //   '> svg': {
  //     animation:
  //       animating && animation !== 'none' ? `${theme.animation[animation]} 1000ms ease-out` : '',
  //   },
}));

export const ButtonText = styled.Text<{
  variant: ButtonProps['variant'];
  active: ButtonProps['active'];
}>(({ theme, variant, active }) => ({
  color: (() => {
    if (variant === 'solid') return theme.color.lightest;
    if (variant === 'outline') return theme.input.color;
    if (variant === 'ghost' && active) return theme.color.secondary;
    if (variant === 'ghost') return theme.color.mediumdark;
    return theme.input.color;
  })(),
  flexDirection: 'row',
  gap: 6,
  textAlign: 'center',
  // lineHeight: theme.typography.size.s1,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
}));

export const ButtonIcon = ({
  Icon,
  active,
  variant,
}: {
  Icon: (props: SvgProps) => ReactElement;
  variant: ButtonProps['variant'];
  active: ButtonProps['active'];
}) => {
  const theme = useTheme();

  const color = useMemo(() => {
    if (variant === 'solid') return theme.color.lightest;
    if (variant === 'outline') return theme.input.color;
    if (variant === 'ghost' && active) return theme.color.secondary;
    if (variant === 'ghost') return theme.color.mediumdark;
    return theme.input.color;
  }, [
    active,
    theme.color.lightest,
    theme.color.mediumdark,
    theme.color.secondary,
    theme.input.color,
    variant,
  ]);

  return <Icon color={color} />;
};

// color: variant === 'ghost' ? theme.color.secondary : null,
// background: (() => {
//   let bgColor = theme.color.secondary;
//   if (variant === 'solid') bgColor = theme.color.secondary;
//   if (variant === 'outline') bgColor = theme.button.background;

//   if (variant === 'ghost') return theme.background.hoverable;
//   return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
// })(),
