import React, { Component, SyntheticEvent } from 'react';

import { styled } from '@storybook/theming';
import store, { clearElements } from '../redux-config';
import HighlightToggle from './Report/HighlightToggle';
import { NodeResult, Result } from 'axe-core';
import { RuleType } from './A11YPanel';

// TODO: reuse the Tabs component from @storybook/theming instead of re-building identical functionality

const Container = styled.div({
  width: '100%',
  position: 'relative',
  minHeight: '100%',
});

const HighlightToggleLabel = styled.label(({ theme }) => ({
  cursor: 'pointer',
  userSelect: 'none',
  marginBottom: '3px',
  marginRight: '3px',
  color: theme.color.dark,
}));

const GlobalToggleWrapper = styled.div(({ theme }) => {
  return `
    padding: 10px 12px 10px 0;
    cursor: pointer;
    font-size: ${theme.typography.size.s2 - 1}px;
    height: 40px;
    border: none;
    margin-top: -40px;
    float: right;
    display: flex;
    align-items: center;

    @media (max-width: 665px) {
      display: block;
      margin-top: 0px;
      padding: 12px 0px 3px 12px;
      width: 100%;
      float: left;
      border-bottom: 1px solid rgba(0,0,0,.1);
    }

    input: {
      margin-left: 10;
      margin-right: 0;
      margin-top: 0;
      margin-bottom: 0;
    }
  `;
});

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

const TabsWrapper = styled.div({});

const List = styled.div(({ theme }) => ({
  boxShadow: `${theme.appBorderColor} 0 -1px 0 0 inset`,
  background: 'rgba(0, 0, 0, .05)',
  display: 'flex',
  justifyContent: 'space-between',
  whiteSpace: 'nowrap',
}));

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

function retrieveAllNodesFromResults(items: Result[]): NodeResult[] {
  return items.reduce((acc, item) => acc.concat(item.nodes), []);
}

export class Tabs extends Component<TabsProps, TabsState> {
  state: TabsState = {
    active: 0,
  };

  onToggle = (event: SyntheticEvent) => {
    this.setState({
      active: parseInt(event.currentTarget.getAttribute('data-index'), 10),
    });
    // removes all elements from the redux map in store from the previous panel
    store.dispatch(clearElements());
  };

  render() {
    const { tabs } = this.props;
    const { active } = this.state;
    const highlightToggleId = `${tabs[active].type}-global-checkbox`;
    const highlightLabel = `Highlight results`;
    return (
      <Container>
        <List>
          <TabsWrapper>
            {tabs.map((tab, index) => (
              <Item
                key={index}
                data-index={index}
                active={active === index}
                onClick={this.onToggle}
              >
                {tab.label}
              </Item>
            ))}
          </TabsWrapper>
        </List>
        <GlobalToggleWrapper>
          <HighlightToggleLabel htmlFor={highlightToggleId}>
            {highlightLabel}
          </HighlightToggleLabel>
          <HighlightToggle
            toggleId={highlightToggleId}
            type={tabs[active].type}
            elementsToHighlight={retrieveAllNodesFromResults(tabs[active].items)}
            label={highlightLabel}
          />
        </GlobalToggleWrapper>
        {tabs[active].panel}
      </Container>
    );
  }
}
