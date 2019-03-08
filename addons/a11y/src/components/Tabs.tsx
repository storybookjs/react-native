import React, { Component } from 'react';

import { styled } from '@storybook/theming';
// TODO: reuse the Tabs component from @storybook/theming instead
// of re-building identical functionality

const Container = styled.div({
  width: '100%',
  position: 'relative',
  minHeight: '100%',
});

const List = styled.div(({ theme }) => ({
  boxShadow: `${theme.appBorderColor} 0 -1px 0 0 inset`,
  background: 'rgba(0,0,0,.05)',
  flexWrap: 'wrap',
  display: 'flex',
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
  };

  render() {
    const { tabs } = this.props;
    const { active } = this.state;

    return (
      <Container>
        <List>
          {tabs.map((tab, index) => (
            <Item
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              active={active === index ? true : undefined}
              onClick={() => this.onToggle(index)}
            >
              {tab.label}
            </Item>
          ))}
        </List>
        {tabs[active].panel}
      </Container>
    );
  }
}
