import { styled, useTheme } from '@storybook/react-native-theming';
import { ReactElement, forwardRef, useEffect, useMemo, useState } from 'react';
import type { TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  asChild?: boolean;
  size?: 'small' | 'medium';
  padding?: 'small' | 'medium';
  variant?: 'outline' | 'solid' | 'ghost';
  disabled?: boolean;
  active?: boolean;
  animation?: 'none' | 'rotate360' | 'glow' | 'jiggle';
  text?: string;
  Icon?: (props: { color: string }) => ReactElement;
}

// TODO fix this type
export const Button = forwardRef<any, ButtonProps>(
  (
    {
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
    }: ButtonProps,
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

    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        padding={padding}
        disabled={disabled}
        active={active}
        animating={isAnimating}
        animation={animation}
        onPress={handleClick}
        accessibilityRole="button"
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

const StyledButton = styled.TouchableOpacity<
  ButtonProps & { animating: boolean; animation: ButtonProps['animation'] }
>(({ theme, variant, size, disabled, active, padding }) => ({
  border: 0,
  // cursor: disabled ? 'not-allowed' : 'pointer',
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
  transitionProperty: 'background, box-shadow',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-out',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  opacity: disabled ? 0.5 : 1,
  margin: 0,

  backgroundColor: (() => {
    if (variant === 'solid') return theme.color.secondary;
    if (variant === 'outline') return theme.button.background;
    if (variant === 'ghost' && active) return theme.background.hoverable;

    return 'transparent';
  })(),

  boxShadow: variant === 'outline' ? `${theme.button.border} 0 0 0 1px inset` : 'none',
  borderRadius: theme.input.borderRadius,
  // Making sure that the button never shrinks below its minimum size
  flexShrink: 0,
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
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
}));

export const ButtonIcon = ({
  Icon,
  active,
  variant,
}: {
  Icon: (props: { color: string }) => ReactElement;
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
