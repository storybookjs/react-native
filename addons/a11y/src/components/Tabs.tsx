import React, { Component, Fragment } from 'react';

import { styled } from '@storybook/theming';
import store, { clearElements } from '../redux-config';
import HighlightToggle from './Report/HighlightToggle';
import { NodeResult, Result } from 'axe-core';
import { RuleType } from './A11YPanel';

// TODO: reuse the Tabs component from @storybook/theming instead
// of re-building identical functionality

const Container = styled.div({
  width: '100%',
  position: 'relative',
  minHeight: '100%',
});

const HighlightToggleLabel = styled.label(({ theme }) => ({
  cursor: 'pointer',
  userSelect: 'none',
  color: theme.color.dark,
}));

const GlobalToggleWrapper = styled.div(({ theme }) => ({
  float: 'right',
  paddingRight: '5px',
  textDecoration: 'none',
  padding: '10px 15px',
  cursor: 'pointer',
  fontSize: theme.typography.size.s2 - 1,
  lineHeight: 1,
  height: 40,
  border: 'none',
  borderTop: '2px solid transparent',
  borderBottom: '2px solid transparent',
  background: 'transparent',
}));

const List = styled.div(({ theme }) => ({
  boxShadow: `${theme.appBorderColor} 0 -1px 0 0 inset`,
  background: 'rgba(0,0,0,.05)',
}));

const Item = styled.button(
  ({ theme }) => ({
    textDecoration: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    fontWeight: theme.typography.weight.bold,
    fontSize: theme.typography.size.s2 - 1,
    lineHeight: 1,
    height: 40,
    border: 'none',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',
    background: 'transparent',

    '&:focus': {
      outline: '0 none',
      borderBottom: `3px solid ${theme.color.secondary}`,
    },
  }),
  ({ active, theme }: any) =>
    active
      ? {
          opacity: 1,
          borderBottom: `3px solid ${theme.color.secondary}`,
        }
      : {}
);

interface TabsProps {
  tabs: Array<{
    label: JSX.Element;
    panel: JSX.Element;
    items: Result[];
    type: RuleType;
  }>;
}

interface TabsState {
  active: number;
}

export class Tabs extends Component<TabsProps, TabsState> {
  state: TabsState = {
    active: 0,
  };

  onToggle = (index: number) => {
    this.setState({
      active: index,
    });
    // removes all elements from the redux map in store from the previous panel
    store.dispatch(clearElements(null));
  };

  retrieveAllNodeResults(items: Result[]): NodeResult[] {
    let nodeArray: NodeResult[] = [];
    for (const item of items) {
      nodeArray = nodeArray.concat(item.nodes);
    }
    return nodeArray;
  }

  render() {
    const { tabs } = this.props;
    const { active } = this.state;
    const highlightToggleId = `${tabs[active].type}-global-checkbox`;
    const highlightLabel = `Highlight results`;
    return (
      <Container>
        <List>
          {tabs.map((tab, index) => (
            <Item
              key={index}
              active={active === index ? true : undefined}
              onClick={() => this.onToggle(index)}>
              {tab.label}
            </Item>
          ))}
          <GlobalToggleWrapper>
            <HighlightToggle
              toggleId={highlightToggleId}
              type={tabs[active].type}
              elementsToHighlight={this.retrieveAllNodeResults(tabs[active].items)}
              label={highlightLabel}
            />
            <HighlightToggleLabel htmlFor={highlightToggleId}>{highlightLabel}</HighlightToggleLabel>
          </GlobalToggleWrapper>
        </List>
        {tabs[active].panel}
      </Container>
    );
  }
}
