import React, { Component, Fragment, FunctionComponent } from 'react';

import { styled } from '@storybook/theming';
import memoize from 'memoizerific';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';
import { RuleType } from '../A11YPanel';
import HighlightToggle from './HighlightToggle';

const Item = styled.li({
  fontWeight: 600,
});

const ItemTitle = styled.span({
  borderBottom: '1px solid rgb(130, 130, 130)',
  width: '100%',
  display: 'inline-block',
  paddingBottom: '4px',
  marginBottom: '4px',
});

const HighlightText = styled.span({
  paddingLeft: '15px',
  fontWeight: 'normal',
});

interface ElementProps {
  element: NodeResult;
  passes: boolean;
  type: RuleType;
}

const Element: FunctionComponent<ElementProps> = ({ element, passes, type }) => {
  const { any, all, none } = element;
  const rules = [...any, ...all, ...none];
  const highlightToggleId = `${type}-${element.target[0]}`;
  const highlightLabel = `Highlight`;

  return (
    <Item>
      <ItemTitle>
        {element.target[0]}
        <HighlightText>
          <HighlightToggle toggleId={highlightToggleId} type={type} elementsToHighlight={[element]} label={highlightLabel} />
        </HighlightText>
      </ItemTitle>
      <Rules rules={rules} passes={passes} />
    </Item>
  );
};

interface ElementsProps {
  elements: NodeResult[];
  passes: boolean;
  type: RuleType;
}

export const Elements: FunctionComponent<ElementsProps> = ({ elements, passes, type }) => (
  <ol>
    {elements.map((element, index) => (
      <Element passes={passes} element={element} key={index} type={type} />
    ))}
  </ol>
);
