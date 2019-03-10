import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled, withTheme } from '@storybook/theming';
import * as persistance from './persist';

import { Draggable, Handle } from './draggers';

export const Root = styled.div({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
});

const Pane = styled.div(
  {
    position: 'absolute',
    boxSizing: 'border-box',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  ({ hidden }) =>
    hidden
      ? {
          opacity: 0,
        }
      : {
          opacity: 1,
        },
  ({ top }) =>
    top
      ? {
          zIndex: 9,
        }
      : {},
  ({ border, theme }) => {
    switch (border) {
      case 'left': {
        return {
          borderLeft: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'right': {
        return {
          borderRight: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'top': {
        return {
          borderTop: `1px solid ${theme.appBorderColor}`,
        };
      }
      case 'bottom': {
        return {
          borderBottom: `1px solid ${theme.appBorderColor}`,
        };
      }
      default: {
        return {};
      }
    }
  },
  ({ animate }) =>
    animate
      ? {
          transition: ['width', 'height', 'top', 'left', 'background', 'opacity', 'transform']
            .map(p => `${p} 0.1s ease-out`)
            .join(','),
        }
      : {}
);

const Paper = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  ({ isFullscreen, theme }) =>
    isFullscreen
      ? {
          boxShadow: 'none',
          borderRadius: '0',
        }
      : {
          background: theme.background.content,
          borderRadius: theme.appBorderRadius,
          overflow: 'hidden',
          boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.1)',
        }
);

export const Nav = ({ hidden, children, position, ...props }) =>
  hidden ? null : (
    <Pane style={position} {...props}>
      {children}
    </Pane>
  );

Nav.propTypes = {
  hidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  position: PropTypes.shape({}),
};
Nav.defaultProps = {
  hidden: false,
  position: undefined,
};

export const Main = ({ isFullscreen, children, position, ...props }) => (
  <Pane style={position} top {...props}>
    <Paper isFullscreen={isFullscreen}>{children}</Paper>
  </Pane>
);

Main.propTypes = {
  isFullscreen: PropTypes.bool,
  children: PropTypes.node.isRequired,
  position: PropTypes.shape({}),
};
Main.defaultProps = {
  isFullscreen: false,
  position: undefined,
};

export const Preview = ({ hidden, children, position, ...props }) => (
  <Pane style={position} top hidden={hidden} {...props}>
    {children}
  </Pane>
);

Preview.propTypes = {
  hidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  position: PropTypes.shape({}),
};
Preview.defaultProps = {
  hidden: false,
  position: undefined,
};

export const Panel = ({ hidden, children, position, align, ...props }) => (
  <Pane style={position} hidden={hidden} {...props} border={align === 'bottom' ? 'top' : 'left'}>
    {children}
  </Pane>
);

Panel.propTypes = {
  hidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  position: PropTypes.shape({}),
  align: PropTypes.oneOf(['bottom', 'right']),
};

Panel.defaultProps = {
  hidden: false,
  position: undefined,
  align: 'right',
};

const HoverBlocker = styled.div({
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 15,
  height: '100vh',
  width: '100vw',
});

const getPreviewPosition = ({
  panelPosition,
  isPanelHidden,
  isNavHidden,
  isFullscreen,
  bounds,
  resizerPanel,
  resizerNav,
  margin,
}) => {
  if (isFullscreen || isPanelHidden) {
    return {};
  }

  const navX = isNavHidden ? 0 : resizerNav.x;
  const panelX = isPanelHidden ? 0 : resizerPanel.x;
  const panelY = isPanelHidden ? 0 : resizerPanel.y;

  return panelPosition === 'bottom'
    ? {
        height: panelY - margin,
        left: 0,
        top: 0,
        width: bounds.width - navX - 2 * margin,
      }
    : {
        height: bounds.height - 2 * margin,
        left: 0,
        top: 0,
        width: panelX - navX - margin,
      };
};

const getMainPosition = ({ bounds, resizerNav, isNavHidden, isFullscreen, margin }) => {
  if (isFullscreen) {
    return {};
  }

  const navX = isNavHidden ? 0 : resizerNav.x;

  return {
    height: bounds.height - margin * 2,
    left: navX + margin,
    top: margin,
    width: bounds.width - navX - margin * 2,
  };
};

const getPanelPosition = ({
  isPanelBottom,
  isPanelHidden,
  isNavHidden,
  bounds,
  resizerPanel,
  resizerNav,
  margin,
}) => {
  const navX = isNavHidden ? 0 : resizerNav.x;
  const panelX = resizerPanel.x;
  const panelY = resizerPanel.y;

  if (isPanelBottom && isPanelHidden) {
    return {
      height: bounds.height - panelY - margin,
      left: 0,
      top: panelY - margin,
      width: bounds.width - navX - 2 * margin,
    };
  }
  if (!isPanelBottom && isPanelHidden) {
    return {
      height: bounds.height - 2 * margin,
      left: panelX - navX - margin,
      top: 0,
      width: bounds.width - panelX - margin,
    };
  }

  return isPanelBottom
    ? {
        height: bounds.height - panelY - margin,
        left: 0,
        top: panelY - margin,
        width: bounds.width - navX - 2 * margin,
      }
    : {
        height: bounds.height - 2 * margin,
        left: panelX - navX - margin,
        top: 0,
        width: bounds.width - panelX - margin,
      };
};

class Layout extends Component {
  constructor(props) {
    super(props);

    const { bounds, options } = props;

    const { resizerNav, resizerPanel } = persistance.get();

    this.state = {
      isDragging: false,
      resizerNav: resizerNav || { x: 200, y: 0 },
      resizerPanel:
        resizerPanel ||
        (options.panelPosition === 'bottom'
          ? { x: 0, y: bounds.height - 400 }
          : { x: bounds.width - 400, y: 0 }),
    };
  }

  componentDidUpdate() {
    const { resizerPanel, resizerNav } = this.state;

    persistance.set({
      resizerPanel,
      resizerNav,
    });
  }

  static getDerivedStateFromProps(props, state) {
    const { bounds, options } = props;
    const { resizerPanel, resizerNav } = state;

    const isNavHidden = options.isFullscreen || !options.showNav;
    const isPanelHidden = options.isFullscreen || !options.showPanel;

    const { panelPosition } = options;
    const isPanelRight = panelPosition === 'right';
    const isPanelBottom = panelPosition === 'bottom';

    const navX = resizerNav.x;
    const panelX = resizerPanel.x;
    const panelY = resizerPanel.y;
    const minimalMainWidth = !isPanelHidden && isPanelRight ? 400 : 200;

    const mutation = {};

    if (!isNavHidden) {
      if (bounds.width - minimalMainWidth < navX) {
        mutation.resizerNav = {
          x: bounds.width - minimalMainWidth,
          y: 0,
        };
      } else if (bounds.width - minimalMainWidth < 200 || navX < 200) {
        mutation.resizerNav = {
          x: 200,
          y: 0,
        };
      }
    }
    if (isPanelRight && !isPanelHidden) {
      if (bounds.width - 200 < panelX || panelX === 0) {
        mutation.resizerPanel = {
          x: bounds.width - 200,
          y: 0,
        };
      } else if (navX + 200 > panelX) {
        mutation.resizerPanel = {
          x: navX + 200,
          y: 0,
        };
      }
    }

    if (isPanelBottom && !isPanelHidden) {
      if (bounds.height - 200 < panelY || panelY === 0) {
        mutation.resizerPanel = {
          x: 0,
          y: bounds.height - 200,
        };
      }
    }

    return mutation.resizerPanel || mutation.resizerNav ? { ...state, ...mutation } : state;
  }

  resizeNav = (e, data) => {
    if (data.deltaX) {
      this.setState({ resizerNav: { x: data.x, y: data.y } });
    }
  };

  resizePanel = (e, data) => {
    const { options } = this.props;

    if (
      (data.deltaY && options.panelPosition === 'bottom') ||
      (data.deltaX && options.panelPosition === 'right')
    ) {
      this.setState({ resizerPanel: { x: data.x, y: data.y } });
    }
  };

  setDragNav = () => {
    this.setState({ isDragging: 'nav' });
  };

  setDragPanel = () => {
    this.setState({ isDragging: 'panel' });
  };

  unsetDrag = () => {
    this.setState({ isDragging: false });
  };

  render() {
    const { children, bounds, options, theme, viewMode } = this.props;
    const { isDragging, resizerNav, resizerPanel } = this.state;

    const margin = theme.layoutMargin;
    const isNavHidden = options.isFullscreen || !options.showNav;
    const isPanelHidden = options.isFullscreen || !options.showPanel || viewMode !== 'story';
    const isFullscreen = options.isFullscreen || (isNavHidden && isPanelHidden);
    const { isToolshown } = options;

    const { panelPosition } = options;
    const isPanelBottom = panelPosition === 'bottom';
    const isPanelRight = panelPosition === 'right';

    const panelX = resizerPanel.x;
    const navX = resizerNav.x;

    return bounds ? (
      <Fragment>
        {isNavHidden ? null : (
          <Draggable
            axis="x"
            position={resizerNav}
            bounds={{
              left: 200,
              top: 0,
              right: isPanelRight && !isPanelHidden ? panelX - 200 : bounds.width - 200,
              bottom: 0,
            }}
            onStart={this.setDragNav}
            onDrag={this.resizeNav}
            onStop={this.unsetDrag}
          >
            <Handle
              shadow="left"
              axis="x"
              isDragging={isDragging === 'nav'}
              style={{ marginLeft: margin / 2 }}
            />
          </Draggable>
        )}

        {isPanelHidden ? null : (
          <Draggable
            axis={isPanelBottom ? 'y' : 'x'}
            position={resizerPanel}
            bounds={
              isPanelBottom
                ? {
                    left: 0,
                    top: 200,
                    right: 0,
                    bottom: bounds.height - 200,
                  }
                : {
                    left: isNavHidden ? 200 : navX + 200,
                    top: 0,
                    right: bounds.width - 200,
                    bottom: 0,
                  }
            }
            onStart={this.setDragPanel}
            onDrag={this.resizePanel}
            onStop={this.unsetDrag}
          >
            <Handle
              isDragging={isDragging === 'panel'}
              shadow={isPanelBottom ? 'top' : 'left'}
              style={
                isPanelBottom
                  ? {
                      left: navX + margin,
                      width: bounds.width - navX - 2 * margin,
                      marginTop: -margin / 2,
                    }
                  : { marginLeft: -margin / 2 }
              }
              axis={isPanelBottom ? 'y' : 'x'}
            />
          </Draggable>
        )}

        {isDragging ? <HoverBlocker /> : null}
        {children({
          mainProps: {
            animate: !isDragging,
            isFullscreen,
            position: getMainPosition({ bounds, resizerNav, isNavHidden, isFullscreen, margin }),
          },
          previewProps: {
            animate: !isDragging,
            isFullscreen,
            isToolshown,
            position: getPreviewPosition({
              isFullscreen,
              isNavHidden,
              isPanelHidden,
              resizerNav,
              resizerPanel,
              bounds,
              panelPosition,
              margin,
            }),
          },
          navProps: {
            animate: !isDragging,
            hidden: isNavHidden,
            position: {
              height: bounds.height,
              left: 0,
              top: 0,
              width: navX + margin,
            },
          },
          panelProps: {
            animate: !isDragging,
            align: options.panelPosition,
            hidden: isPanelHidden,
            position: getPanelPosition({
              isPanelBottom,
              isPanelHidden,
              isNavHidden,
              bounds,
              resizerPanel,
              resizerNav,
              margin,
            }),
          },
        })}
      </Fragment>
    ) : null;
  }
}
Layout.propTypes = {
  children: PropTypes.func.isRequired,
  bounds: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool.isRequired,
    showNav: PropTypes.bool.isRequired,
    showPanel: PropTypes.bool.isRequired,
    panelPosition: PropTypes.string.isRequired,
  }).isRequired,
  viewMode: PropTypes.oneOf(['story', 'info']),
  theme: PropTypes.shape({}).isRequired,
};
Layout.defaultProps = {
  viewMode: undefined,
};

const ThemedLayout = withTheme(Layout);

export { ThemedLayout as Layout };
