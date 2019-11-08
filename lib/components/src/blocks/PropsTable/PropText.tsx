import React, { FC } from 'react';
import { isNil } from 'lodash';

interface PropTextProps {
  text?: string;
  title?: string;
}

export const PropText: FC<PropTextProps> = ({ text, title, ...props }) => {
  // TODO: Redo with styled in js
  const style = {};
  if (!isNil(title)) {
    // @ts-ignore
    style.borderBottom = '1px solid blue';
  }

  return (
    <span {...props} title={title} style={style}>
      {isNil(text) ? '-' : text}
    </span>
  );
};
