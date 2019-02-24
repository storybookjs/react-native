import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';

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

interface ElementProps {
  element: NodeResult;
  passes: boolean;
}

const Element: FunctionComponent<ElementProps> = ({ element, passes }) => {
  const { any, all, none } = element;

  const rules = [...any, ...all, ...none];

  return (
    <Item>
      <ItemTitle>{element.target[0]}</ItemTitle>
      <Rules rules={rules} passes={passes} />
    </Item>
  );
};

interface ElementsProps {
  elements: NodeResult[];
  passes: boolean;
}

export const Elements: FunctionComponent<ElementsProps> = ({ elements, passes }) => (
  <ol>
    {elements.map((element, index) => (
      <Element passes={passes} element={element} key={index} />
    ))}
  </ol>
);
