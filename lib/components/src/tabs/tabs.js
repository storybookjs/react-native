import React, { Component } from 'react';

import Fragment from 'render-fragment';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Placeholder from '../placeholder/placeholder';

const Wrapper = styled.div(
  ({ theme, bordered }) =>
    bordered
      ? {
          background: theme.mainFill,
          borderRadius: theme.mainBorderRadius,
          border: theme.mainBorder,
        }
      : {},
  ({ absolute }) =>
    absolute
      ? {
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

export const TabBar = styled.div(({ theme }) => ({
  background: theme.barFill,
  borderBottom: theme.mainBorder,
  overflow: 'auto',
  padding: '0 8px',
  whiteSpace: 'nowrap',
  height: 40,
}));

const TabButton = styled.button(
  {
    whiteSpace: 'normal',
    display: 'inline-flex',
    overflow: 'hidden',
    verticalAlign: 'top',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

    '&:empty': {
      display: 'none',
    },
  },
  ({ theme }) => ({
    fontSize: 11,
    letterSpacing: '1px',
    padding: '0 8px',
    textTransform: 'uppercase',
    transition: 'color 0.2s linear, border-bottom-color 0.2s linear',
    height: 40,
    lineHeight: '12px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    background: 'transparent',
    border: '0 solid transparent',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',

    '&:focus': {
      outline: '0 none',
      borderBottomColor: theme.highlightColor,
    },
  }),
  ({ active, theme }) =>
    active
      ? {
          color: theme.mainTextColor,
          borderBottomColor: theme.barSelectedColor,
        }
      : {
          color: theme.dimmedTextColor,
          borderBottomColor: 'transparent',
        }
);

const Content = styled.div(
  {
    display: 'block',
    position: 'relative',
  },
  ({ absolute }) =>
    absolute
      ? {
          position: 'relative',
          overflow: 'auto',
          flex: 1,
          width: '100%',
        }
      : {}
);

export const Tab = ({ active, name, title, onSelect }) => {
  const onClick = e => {
    e.preventDefault();
    onSelect(name);
  };

  return (
    <TabButton type="button" key={name} active={active} onClick={onClick} role="tab">
      {typeof title === 'function' ? title() : title}
    </TabButton>
  );
};

Tab.propTypes = {
  active: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  onSelect: PropTypes.func.isRequired,
};

const VisuallyHidden = styled.div(({ active }) =>
  active ? { display: 'block' } : { display: 'none' }
);
export const TabWrapper = ({ active, render, children }) => (
  <VisuallyHidden active={active}>{render ? render() : children}</VisuallyHidden>
);
TabWrapper.propTypes = {
  active: PropTypes.bool.isRequired,
  render: PropTypes.func,
  children: PropTypes.node,
};
TabWrapper.defaultProps = {
  render: undefined,
  children: undefined,
};

export const panelProps = {
  active: PropTypes.bool,
};

export const Tabs = ({ children, selected, onSelect, absolute, bordered }) => {
  const list = React.Children.toArray(children).map(
    ({ props: { title, id, children: childrenOfChild } }, index) => {
      const content = Array.isArray(childrenOfChild) ? childrenOfChild[0] : childrenOfChild;
      return {
        active: selected ? id === selected : index === 0,
        title,
        id,
        render:
          typeof content === 'function'
            ? content
            : // eslint-disable-next-line react/prop-types
              ({ active }) => (
                <VisuallyHidden active={active} role="tabpanel">
                  {content}
                </VisuallyHidden>
              ),
      };
    }
  );

  return list.length ? (
    <Wrapper absolute={absolute} bordered={bordered}>
      <TabBar role="tablist">
        {list.map(({ title, id, active }) => (
          <Tab key={`${id}-bar`} active={active} name={id} title={title} onSelect={onSelect} />
        ))}
      </TabBar>
      <Content absolute={absolute}>
        {list.map(({ id, active, render }) => (
          <Fragment key={`${id}-panel`}>
            {render({
              active,
              selected,
            })}
          </Fragment>
        ))}
      </Content>
    </Wrapper>
  ) : (
    <Placeholder>no panels available</Placeholder>
  );
};
Tabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  absolute: PropTypes.bool.isRequired,
  bordered: PropTypes.bool.isRequired,
};
Tabs.defaultProps = {
  children: [],
  selected: null,
};

export class TabsState extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
    initial: PropTypes.string,
    absolute: PropTypes.bool,
    bordered: PropTypes.bool,
  };

  static defaultProps = {
    children: [],
    initial: null,
    absolute: false,
    bordered: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.initial,
    };
  }

  render() {
    const { bordered, absolute, children } = this.props;
    const { selected } = this.state;
    return (
      <Tabs
        bordered={bordered || true}
        absolute={absolute || false}
        selected={selected}
        onSelect={id => this.setState({ selected: id })}
      >
        {children}
      </Tabs>
    );
  }
}
