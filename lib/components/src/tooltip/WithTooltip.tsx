import React, { FunctionComponent, ReactNode } from 'react';
import { styled } from '@storybook/theming';
import { logger } from '@storybook/client-logger';
import { withState, lifecycle } from 'recompose';
import { document } from 'global';

import TooltipTrigger from 'react-popper-tooltip';
import Tooltip from './Tooltip';
import { Modifiers, Placement } from 'popper.js';

// A target that doesn't speak popper
const TargetContainer = styled.div<{ mode: string }>`
  display: inline-block;
  cursor: ${props => (props.mode === 'hover' ? 'default' : 'pointer')};
`;

const TargetSvgContainer = styled.g<{ mode: string }>`
  cursor: ${props => (props.mode === 'hover' ? 'default' : 'pointer')};
`;

interface WithTooltipPureProps {
  svg?: boolean;
  trigger?: 'none' | 'hover' | 'click' | 'right-click';
  closeOnClick?: boolean;
  placement?: Placement;
  modifiers?: Modifiers;
  hasChrome?: boolean;
  tooltip: ReactNode;
  children: ReactNode;
  tooltipShown?: boolean;
  onVisibilityChange?: (visibility: boolean) => void;
}

// Pure, does not bind to the body
const WithTooltipPure: FunctionComponent<WithTooltipPureProps> = ({
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

WithTooltipPure.defaultProps = {
  svg: false,
  trigger: 'hover',
  closeOnClick: false,
  placement: 'top',
  modifiers: {},
  hasChrome: true,
  tooltipShown: false,
};

const WithTooltip = lifecycle<WithTooltipPureProps, {}>({
  componentDidMount() {
    const { onVisibilityChange } = this.props;
    const hide = () => onVisibilityChange(false);
    document.addEventListener('keydown', hide, false);

    // Find all iframes on the screen and bind to clicks inside them (waiting until the iframe is ready)
    const iframes: HTMLIFrameElement[] = Array.from(document.getElementsByTagName('iframe'));
    const unbinders: Array<() => void> = [];
    iframes.forEach(iframe => {
      const bind = () => {
        try {
          if (iframe.contentWindow.document) {
            iframe.contentWindow.document.addEventListener('click', hide);
            unbinders.push(() => {
              try {
                iframe.contentWindow.document.removeEventListener('click', hide);
              } catch (e) {
                logger.warn('Removing a click listener from iframe failed: ', e);
              }
            });
          }
        } catch (e) {
          logger.warn('Adding a click listener to iframe failed: ', e);
        }
      };

      bind(); // I don't know how to find out if it's already loaded so I potentially will bind twice
      iframe.addEventListener('load', bind);
      unbinders.push(() => {
        iframe.removeEventListener('load', bind);
      });
    });

    (this as any).unbind = () => {
      document.removeEventListener('keydown', hide);
      unbinders.forEach(unbind => {
        unbind();
      });
    };
  },
  componentWillUnmount() {
    if ((this as any).unbind) {
      (this as any).unbind();
    }
  },
})(WithTooltipPure);

export default WithTooltip;

const WithToolTipState: any = withState(
  'tooltipShown',
  'onVisibilityChange',
  ({ startOpen }) => startOpen
)(WithTooltip as any);

export { WithTooltipPure, WithToolTipState };
