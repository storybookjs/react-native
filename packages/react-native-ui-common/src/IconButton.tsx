import { Button, ButtonProps } from './Button';
import { forwardRef } from 'react';

export const IconButton = forwardRef(
  ({ padding = 'small', variant = 'ghost', ...props }: ButtonProps, ref) => {
    return <Button padding={padding} variant={variant} ref={ref} {...props} />;
  }
);

IconButton.displayName = 'IconButton';
