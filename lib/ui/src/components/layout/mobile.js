import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

import { TabButton } from '@storybook/components';
import { Root } from './container';

const Pane = styled.div(
  {
    transition: 'transform .2s ease',
    position: 'absolute',
    top: 0,
    height: '100%',
  },
  ({ theme }) => ({
    background: theme.background.content,
    '&:nth-of-type(1)': {
      borderRight: `1px solid ${theme.appBorderColor}`,
    },
    '&:nth-of-type(3)': {
      borderLeft: `1px solid ${theme.appBorderColor}`,
    },
  }),
  ({ index }) => {
    switch (index) {
      case 0: {
        return {
          width: '80vw',
          transform: 'translateX(-80vw)',
          left: 0,
        };
      }
      case 1: {
        return {
          width: '100%',
          transform: 'translateX(0) scale(1)',
          left: 0,
        };
      }
      case 2: {
        return {
          width: '80vw',
          transform: 'translateX(80vw)',
          right: 0,
        };
      }
      default: {
        return {};
      }
    }
  },
  ({ active, index }) => {
    switch (true) {
      case index === 0 && active === 0: {
        return {
          transform: 'translateX(-0px)',
        };
      }
      case index === 1 && active === 0: {
        return {
          transform: 'translateX(40vw) translateY(-42.5vh) translateY(40px) scale(0.2)',
        };
      }
      case index === 1 && active === 2: {
        return {
          transform: 'translateX(-40vw) translateY(-42.5vh) translateY(40px) scale(0.2)',
        };
      }
      case index === 2 && active === 2: {
        return {
          transform: 'translateX(0px)',
        };
      }
      default: {
        return {};
      }
    }
  }
);

const Panels = React.memo(({ children, active }) => (
  <Panels.Container>
    {Children.toArray(children).map((item, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Pane key={index} index={index} active={active}>
        {item}
      </Pane>
    ))}
  </Panels.Container>
));
Panels.displayName = 'Panels';
Panels.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.number.isRequired,
};

Panels.Container = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: 'calc(100% - 40px)',
});

const Bar = styled.nav(
  {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100vw',
    height: 40,
    display: 'flex',
    boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',

    '& > *': {
      flex: 1,
    },
  },
  ({ theme }) => ({
    background: theme.barBg,
  })
);

// eslint-disable-next-line react/no-multi-comp
class Mobile extends Component {
  constructor(props) {
    super();

    const { options } = props;
    this.state = {
      active: !!options.initialActive,
    };
  }

  render() {
    const { Nav, Preview, Panel, Notifications, pages, viewMode, options } = this.props;
    const { active } = this.state;

    return (
      <Root>
        <Notifications
          placement={{
            position: 'fixed',
            bottom: 60,
            left: 20,
            right: 20,
          }}
        />

        <Panels active={active}>
          <Nav />
          <div>
            <div hidden={!viewMode}>
              <Preview
                isToolshown={options.isToolshown}
                id="main"
                viewMode={viewMode}
                debug={options}
              />
            </div>
            {pages.map(({ key, route: Route, render: content }) => (
              <Route key={key}>{content()}</Route>
            ))}
          </div>
          <Panel hidden={!viewMode} />
        </Panels>
        <Bar active={active}>
          <TabButton onClick={() => this.setState({ active: 0 })} active={active === 0}>
            Sidebar
          </TabButton>
          <TabButton
            onClick={() => this.setState({ active: 1 })}
            active={active === 1 || active === false}
          >
            {viewMode ? 'Canvas' : null}
            {pages.map(({ key, route: Route }) => (
              <Route key={key}>{key}</Route>
            ))}
          </TabButton>
          {viewMode ? (
            <TabButton onClick={() => this.setState({ active: 2 })} active={active === 2}>
              Addons
            </TabButton>
          ) : null}
        </Bar>
      </Root>
    );
  }
}

Mobile.displayName = 'MobileLayout';
Mobile.propTypes = {
  Nav: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  Preview: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  Panel: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  Notifications: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      route: PropTypes.func.isRequired,
      render: PropTypes.func.isRequired,
    })
  ).isRequired,
  viewMode: PropTypes.oneOf(['story', 'info']),
  options: PropTypes.shape({
    initialActive: PropTypes.number,
  }).isRequired,
};
Mobile.defaultProps = {
  viewMode: undefined,
};

export { Mobile };
