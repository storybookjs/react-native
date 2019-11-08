import { PropText } from '@storybook/components';
import React, { ReactNode } from 'react';

export function createPropText(text?: string, props: Record<string, any> = {}): ReactNode {
  return <PropText text={text} {...props} />;
}
