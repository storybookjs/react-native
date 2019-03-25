import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';
import { RuleType } from '../A11YPanel';
import HighlightToggle from './HighlightToggle';

const Item = styled.li({
  fontWeight: 600,
});

const ItemTitle = styled.span(({ theme }) => ({
  borderBottom: `1px solid ${theme.appBorderColor}`,
  width: '100%',
  display: 'inline-block',
  paddingBottom: '6px',
  marginBottom: '6px',
}));

const HighlightToggleElement = styled.span({
  fontWeight: 'normal',
  float: 'right',
  paddingRight: '15px',
  input: { margin: 0, },
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
        <HighlightToggleElement>
          <HighlightToggle toggleId={highlightToggleId} type={type} elementsToHighlight={[element]} label={highlightLabel} />
        </HighlightToggleElement>
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
