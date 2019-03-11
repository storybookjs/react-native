import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import logger from '@storybook/client-logger';
import { withState, lifecycle } from 'recompose';
import { document } from 'global';

import TooltipTrigger from 'react-popper-tooltip';
import Tooltip from './Tooltip';

// A target that doesn't speak popper
// prettier-ignore
const TargetContainer = styled.div`
  display: inline-block;
  cursor: ${props => props.mode === 'hover' ? 'default' : 'pointer'};
`;

const TargetSvgContainer = styled.g`
  cursor: ${props => (props.mode === 'hover' ? 'default' : 'pointer')};
`;

// Pure, does not bind to the body
const WithTooltipPure = ({
  svg,
  trigger,
  closeOnClick,
  placement,
  modifiers,
  hasChrome,
  tooltip,
  children,
  tooltipShown,
  onVisibilityChange,
  ...props
}) => {
  const Container = svg ? TargetSvgContainer : TargetContainer;

  return (
    <TooltipTrigger
      placement={placement}
      trigger={trigger}
      modifiers={modifiers}
      tooltipShown={tooltipShown}
      onVisibilityChange={onVisibilityChange}
      tooltip={({
        getTooltipProps,
        getArrowProps,
        tooltipRef,
        arrowRef,
        placement: tooltipPlacement,
      }) => (
        <Tooltip
          hasChrome={hasChrome}
          placement={tooltipPlacement}
          tooltipRef={tooltipRef}
          arrowRef={arrowRef}
          arrowProps={getArrowProps()}
          {...getTooltipProps()}
        >
          {typeof tooltip === 'function'
            ? tooltip({ onHide: () => onVisibilityChange(false) })
            : tooltip}
        </Tooltip>
      )}
    >
      {({ getTriggerProps, triggerRef }) => (
        <Container ref={triggerRef} {...getTriggerProps()} {...props}>
          {children}
        </Container>
      )}
    </TooltipTrigger>
  );
};

WithTooltipPure.propTypes = {
  svg: PropTypes.bool,
  trigger: PropTypes.string,
  closeOnClick: PropTypes.bool,
  placement: PropTypes.string,
  modifiers: PropTypes.shape({}),
  hasChrome: PropTypes.bool,
  tooltip: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  children: PropTypes.node.isRequired,
  tooltipShown: PropTypes.bool,
  onVisibilityChange: PropTypes.func.isRequired,
};

WithTooltipPure.defaultProps = {
  svg: false,
  trigger: 'hover',
  closeOnClick: false,
  placement: 'top',
  modifiers: {},
  hasChrome: true,
  tooltipShown: false,
};

const WithTooltip = lifecycle({
  componentDidMount() {
    const { onVisibilityChange } = this.props;
    const hide = () => onVisibilityChange(false);
    document.addEventListener('keydown', hide, false);

    // Find all iframes on the screen and bind to clicks inside them (waiting until the iframe is ready)
    const iframes = Array.from(document.getElementsByTagName('iframe'));
    const unbinders = [];
    iframes.forEach(iframe => {
      const bind = () => {
        try {
          iframe.contentDocument.addEventListener('click', hide);
          unbinders.push(() => {
            try {
              iframe.contentDocument.removeEventListener('click', hide);
            } catch (e) {
              logger.log('tried to remove listeners from iframe, but failed. whatever');
            }
          });
        } catch (e) {
          logger.log('tried to remove listeners from iframe, but failed. whatever');
        }
      };

      bind(); // I don't know how to find out if it's already loaded so I potentially will bind twice
      iframe.addEventListener('load', bind);
      unbinders.push(() => {
        iframe.removeEventListener('load', bind);
      });
    });

    this.unbind = () => {
      document.removeEventListener('keydown', hide);
      unbinders.forEach(unbind => {
        unbind();
      });
    };
  },
  componentWillUnmount() {
    if (this.unbind) {
      this.unbind();
    }
  },
})(WithTooltipPure);

export default WithTooltip;

const WithToolTipState = withState(
  'tooltipShown',
  'onVisibilityChange',
  ({ startOpen }) => startOpen
)(WithTooltip);

export { WithTooltipPure, WithToolTipState };
