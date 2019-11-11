import React, { FC } from 'react';

interface ItemShape {
  text: string;
  value: string;
}

interface TypeScriptPropsProps {
  arrayOfPrimitive: string[];
  arrayOfShape: ItemShape[];
}

export const TypeScriptProps: FC<TypeScriptPropsProps> = () => <div>TypeScript!</div>;
TypeScriptProps.defaultProps = {
  arrayOfPrimitive: ['foo', 'bar'],
  arrayOfShape: [{ text: 'foo', value: 'bar' }],
};
