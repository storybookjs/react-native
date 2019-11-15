import React from 'react';
import { DocgenButton } from './DocgenButton';

export const ForwardRefButton = React.forwardRef((props, ref) => (
  <DocgenButton ref={ref} {...props} />
));
