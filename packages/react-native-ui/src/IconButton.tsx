import { TouchableOpacity } from 'react-native';
import { Button, ButtonProps } from './Button';
import { forwardRef } from 'react';

export const IconButton = forwardRef<TouchableOpacity, ButtonProps>(
  ({ padding = 'small', variant = 'ghost', ...props }, ref) => {
    return <Button padding={padding} variant={variant} ref={ref} {...props} />;
  }
);

IconButton.displayName = 'IconButton';
