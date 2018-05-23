import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import { Placeholder } from '../';

const Wrapper = styled('div')(
  ({ theme }) => ({
    background: theme.mainFill,
    borderRadius: 4,
    border: theme.mainBorder,
  }),
  ({ absolute }) =>
    absolute
      ? {
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }
      : {
          display: 'block',
        }
);

export const TabBar = styled('div')(({ theme }) => ({
  background: theme.barFill,
  borderBottom: theme.mainBorder,
  overflow: 'auto',
  padding: '0 7.5px',
  whiteSpace: 'nowrap',
  height: 40,
}));

const TabButton = styled('div')(
  {
    whiteSpace: 'normal',
    display: 'inline-flex',
    overflow: 'hidden',
    verticalAlign: 'top',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  {
    fontSize: 11,
    letterSpacing: '1px',
    padding: '0 7.5px',
    textTransform: 'uppercase',
    transition: 'opacity 0.2s',
    height: 40,
    lineHeight: '10px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
  },
  ({ selected }) =>
    selected
      ? {
          opacity: 1,
        }
      : {
          opacity: 0.5,
        }
);

const Content = styled('div')(
  {
    display: 'block',
  },
  ({ absolute }) =>
    absolute
      ? {
          overflow: 'auto',
          flex: 1,
          width: '100%',
        }
      : {}
);

export const Tab = ({ selected, name, title, onSelect }) => {
  const onClick = e => {
    e.preventDefault();
    onSelect(name);
  };

  return (
    <TabButton type="button" key={name} selected={selected} onClick={onClick} role="tab">
      {typeof title === 'function' ? title() : title}
    </TabButton>
  );
};

Tab.propTypes = {
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export const Tabs = ({ panels, selectedPanel, onPanelSelect, absolute }) => {
  const list = panels ? Object.entries(panels) : [];

  return list.length ? (
    <Wrapper absolute={absolute}>
      <TabBar role="tablist">
        {list.map(([name, data]) => (
          <Tab
            key={name}
            selected={name === selectedPanel}
            name={name}
            title={data.title}
            onSelect={onPanelSelect}
          />
        ))}
      </TabBar>
      <Content absolute={absolute}>
        {list.map(([name, { render: Panel }]) => (
          <Panel key={name} active={name === selectedPanel} role="tabpanel" />
        ))}
      </Content>
    </Wrapper>
  ) : (
    <Placeholder>no panels available</Placeholder>
  );
};

const VisuallyHidden = styled('div')(
  ({ active }) => (active ? { display: 'block' } : { display: 'none' })
);
export const TabWrapper = ({ active, render }) => (
  <VisuallyHidden active={active}>{render()}</VisuallyHidden>
);
TabWrapper.propTypes = {
  active: PropTypes.bool.isRequired,
  render: PropTypes.func.isRequired,
};

Tabs.defaultProps = {
  panels: {},
  onPanelSelect: () => {},
  selectedPanel: null,
  absolute: false,
};

Tabs.propTypes = {
  panels: PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    render: PropTypes.func,
  }).isRequired,
  onPanelSelect: PropTypes.func,
  selectedPanel: PropTypes.string,
  absolute: PropTypes.bool,
};

export class TabsState extends Component {
  static propTypes = {
    panels: PropTypes.shape({
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      render: PropTypes.func,
    }).isRequired,
    initial: PropTypes.string,
    absolute: PropTypes.bool,
  };
  static defaultProps = {
    initial: undefined,
    absolute: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.initial || Object.keys(props.panels)[0],
    };
  }
  render() {
    return (
      <Tabs
        absolute={this.props.absolute}
        panels={this.props.panels}
        selectedPanel={this.state.selected}
        onPanelSelect={id => this.setState({ selected: id })}
      />
    );
  }
}

export const panelProps = {
  active: PropTypes.bool,
};
