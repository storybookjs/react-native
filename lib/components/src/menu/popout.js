import { document } from 'global';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import TooltipTrigger from 'react-popper-tooltip';
import FocusLock from 'react-focus-lock';

const Trigger = styled.span({});
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 10,
  marginRight: 10,
  marginTop: 10,
  marginBottom: 0,
  transition: 'opacity 0.3s',
  border: '0 none',
  padding: 0,
  zIndex: 10,
  borderRadius: 4,
  backgroundColor: '#ffffff',
  // boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
  filter: 'drop-shadow(0px 5px 15px rgba(0,0,0,0.2))  drop-shadow(0 0px 3px rgba(0, 0, 0, 0.1))',
});

const Arrow = styled.div(
  {
    height: 10,
    position: 'absolute',
    width: 10,

    '&::after': {
      borderStyle: 'solid',
      content: '""',
      display: 'block',
      height: 0,
      margin: 'auto',
      position: 'absolute',
      width: 0,
    },
  },
  ({ placement }) => {
    const result = {};

    if (!placement) {
      return result;
    }

    if (placement.includes('bottom')) {
      Object.assign(result, {
        height: 10,
        left: 0,
        marginTop: -4,
        top: 0,
        width: 10,

        '&::after': {
          borderColor: 'transparent transparent white transparent',
          borderWidth: '0 5px 5px 5px',
        },
      });

      if (placement.includes('top')) {
        Object.assign(result, {
          bottom: 0,
          height: 10,
          left: 0,
          marginBottom: -10,
          width: 10,

          '&::after': {
            borderColor: 'white transparent transparent transparent',
            borderWidth: '5px 5px 0 5px',
          },
        });
      }
    }

    if (placement.includes('right')) {
      Object.assign(result, {
        height: 10,
        left: 0,
        marginLeft: -11,
        width: 10,

        '&::after': {
          borderColor: 'transparent white transparent transparent',
          borderWidth: '5px 5px 5px 0',
          left: '6px',
          top: 0,
        },
      });
    }

    if (placement.includes('left')) {
      Object.assign(result, {
        height: 10,
        marginRight: -8,
        right: 0,
        width: 10,

        '&::after': {
          borderColor: 'transparent transparent transparent white',
          borderWidth: '5px 0 5px 5px',
          left: 4,
          top: 0,
        },
      });
    }

    return result;
  }
);

const Body = styled.div({
  position: 'relative',
  minWidth: '250px',
});

const placementToOffset = placement => {
  if (placement.includes('start')) {
    return { offset: -10 };
  }
  if (placement.includes('end')) {
    return { offset: 10 };
  }
  return {};
};

export class Popout extends Component {
  constructor(props) {
    super(props);
    this.tooltipRef = React.createRef();
    document.addEventListener('keydown', this.handle);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handle);
  }

  hide = () => {
    this.tooltipRef.current.scheduleHide();
  };

  handle = e => {
    if (e.defaultPrevented) {
      return;
    }
    if (e.key === 'Escape' || e.keyCode === 27) {
      this.hide();
    }
  };

  render() {
    const { children, placement = 'bottom-start', defaultOpen } = this.props;
    const [trigger, content] = children;
    const { hide } = this;

    return (
      <TooltipTrigger
        modifiers={{ offset: placementToOffset(placement) }}
        ref={this.tooltipRef}
        placement={placement}
        defaultTooltipShown={defaultOpen}
        trigger="click"
        tooltip={({
          getTooltipProps,
          getArrowProps,
          tooltipRef,
          arrowRef,
          placement: realPlacement,
        }) => (
          <Container
            {...getTooltipProps({
              ref: tooltipRef,
            })}
          >
            <Arrow
              placement={realPlacement}
              {...getArrowProps({
                ref: arrowRef,
              })}
            />
            <Body>
              <FocusLock autoFocus={false}>
                {typeof content === 'function'
                  ? content({ hide, placement: realPlacement })
                  : content}
              </FocusLock>
            </Body>
          </Container>
        )}
      >
        {({ getTriggerProps, triggerRef }) => (
          <Trigger
            {...getTriggerProps({
              ref: triggerRef,
            })}
          >
            {trigger}
          </Trigger>
        )}
      </TooltipTrigger>
    );
  }
}
Popout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.node, PropTypes.func])).isRequired,
  placement: PropTypes.string,
  defaultOpen: PropTypes.bool,
};
Popout.defaultProps = {
  placement: 'bottom-start',
  defaultOpen: false,
};
