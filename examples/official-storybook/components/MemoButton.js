import React from 'react';
import { DocgenButton } from './DocgenButton';

export const MemoButton = React.memo(props => <DocgenButton {...props} />);
