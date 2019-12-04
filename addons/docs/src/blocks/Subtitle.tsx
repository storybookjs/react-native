import React, { useContext, FunctionComponent } from 'react';
import { Subtitle as PureSubtitle } from '@storybook/components';
import { DocsContext } from './DocsContext';
import { StringSlot } from './shared';

interface SubtitleProps {
  slot?: StringSlot;
  children?: JSX.Element | string;
}

export const Subtitle: FunctionComponent<SubtitleProps> = ({ slot, children }) => {
  const context = useContext(DocsContext);
  const { parameters } = context;
  let text: JSX.Element | string = children;
  if (!text) {
    text = slot ? slot(context) : parameters && parameters.componentSubtitle;
  }
  return text ? <PureSubtitle className="sbdocs-subtitle">{text}</PureSubtitle> : null;
};
