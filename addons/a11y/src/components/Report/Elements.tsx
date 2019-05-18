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
  display: 'flex',
  paddingBottom: '6px',
  marginBottom: '6px',
  justifyContent: 'space-between',
}));

const HighlightToggleElement = styled.span({
  fontWeight: 'normal',
  alignSelf: 'center',
  paddingRight: '15px',
  input: { margin: 0 },
});

interface ElementProps {
  element: NodeResult;
  type: RuleType;
}

const Element: FunctionComponent<ElementProps> = ({ element, type }) => {
  const { any, all, none } = element;
  const rules = [...any, ...all, ...none];
  const highlightToggleId = `${type}-${element.target[0]}`;
  const highlightLabel = `Highlight`;

  return (
    <Item>
      <ItemTitle>
        {element.target[0]}
        <HighlightToggleElement>
          <HighlightToggle
            toggleId={highlightToggleId}
            type={type}
            elementsToHighlight={[element]}
            label={highlightLabel}
          />
        </HighlightToggleElement>
      </ItemTitle>
      <Rules rules={rules} />
    </Item>
  );
};

interface ElementsProps {
  elements: NodeResult[];
  type: RuleType;
}

export const Elements: FunctionComponent<ElementsProps> = ({ elements, type }) => (
  <ol>
    {elements.map((element, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Element element={element} key={index} type={type} />
    ))}
  </ol>
);
