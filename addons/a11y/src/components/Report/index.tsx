import React, { Fragment, FunctionComponent } from 'react';
import { Placeholder } from '@storybook/components';
import { styled } from '@storybook/theming';
import { Result, NodeResult } from 'axe-core';
import { Item } from './Item';
import { RuleType } from '../A11YPanel';
import HighlightToggle from './HighlightToggle';

const GlobalToggleWrapper = styled.div({
  fontWeight: 'bold',
  paddingTop: '5px',
  textAlign: 'right',
  paddingRight: '5px',
});

export interface ReportProps {
  items: Result[];
  empty: string;
  passes: boolean;
  type: RuleType;
}

function retrieveAllNodeResults(items: Result[]): NodeResult[] {
  let nodeArray: NodeResult[] = [];
  for (const item of items) {
    nodeArray = nodeArray.concat(item.nodes);
  }
  return nodeArray;
}

export const Report: FunctionComponent<ReportProps> = ({ items, empty, type, passes }) => (
  <Fragment>
    <GlobalToggleWrapper>
      Highlight Results: <HighlightToggle type={type} elementsToHighlight={retrieveAllNodeResults(items)} />
    </GlobalToggleWrapper>
    {items.length ? (
      items.map(item => <Item passes={passes} item={item} key={item.id} type={type} />)
    ) : (
      <Placeholder key="placeholder">{empty}</Placeholder>
    )}
  </Fragment>
);