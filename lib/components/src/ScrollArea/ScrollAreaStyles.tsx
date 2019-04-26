import { Theme, Interpolation } from '@storybook/theming';

export const getScrollAreaStyles: (theme: Theme) => Interpolation = (theme: Theme) => ({
  '[data-simplebar]': {
    position: 'relative',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    width: 'inherit',
    height: 'inherit',
    maxWidth: 'inherit',
    maxHeight: 'inherit',
  },

  '.simplebar-wrapper': {
    overflow: 'hidden',
    width: 'inherit',
    height: 'inherit',
    maxWidth: 'inherit',
    maxHeight: 'inherit',
  },

  '.simplebar-mask': {
    direction: 'inherit',
    position: 'absolute',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: 'auto !important',
    height: 'auto !important',
    zIndex: 0,
  },

  '.simplebar-offset': {
    direction: 'inherit !important' as 'inherit',
    boxSizing: 'inherit !important' as 'inherit',
    resize: 'none !important' as 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 0,
    margin: 0,
    WebkitOverflowScrolling: 'touch',
  },

  '.simplebar-content': {
    direction: 'inherit',
    boxSizing: 'border-box !important' as 'border-box',
    position: 'relative',
    display: 'block',
    height:
      '100% /* Required for horizontal native scrollbar to not appear if parent is taller than natural height */',
    width: 'auto',
    visibility: 'visible',
    overflow: 'scroll',
    maxWidth: '100% /* Not required for horizontal scroll to trigger */',
    maxHeight: '100% /* Needed for vertical scroll to trigger */',
  },

  '.simplebar-placeholder': {
    maxHeight: '100%',
    maxWidth: '100%',
    width: '100%',
    pointerEvents: 'none',
  },

  '.simplebar-height-auto-observer-wrapper': {
    boxSizing: 'inherit !important' as 'inherit',
    height: '100%',
    width: 'inherit',
    maxWidth: 1,
    position: 'relative',
    float: 'left',
    maxHeight: 1,
    overflow: 'hidden',
    zIndex: -1,
    padding: 0,
    margin: 0,
    pointerEvents: 'none',
    flexGrow: 'inherit',
    flexShrink: 0,
    flexBasis: 0,
  },

  '.simplebar-height-auto-observer': {
    boxSizing: 'inherit',
    display: 'block',
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '1000%',
    width: '1000%',
    minHeight: 1,
    minWidth: 1,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: -1,
  },

  '.simplebar-track': {
    zIndex: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },

  '.simplebar-scrollbar': {
    position: 'absolute',
    right: 2,
    width: 6,
    minHeight: 10,
  },

  '.simplebar-scrollbar:before': {
    position: 'absolute',
    content: '""',
    borderRadius: 6,
    left: 0,
    right: 0,
    opacity: 0,
    transition: 'opacity 0.2s linear',
    background: theme.base === 'light' ? theme.color.darkest : theme.color.lightest,
  },

  '.simplebar-track .simplebar-scrollbar.simplebar-visible:before': {
    /* When hovered, remove all transitions from drag handle */
    opacity: 0.2,
    transition: 'opacity 0s linear',
  },

  '.simplebar-track.simplebar-vertical': {
    top: 0,
    width: 10,
    right: 0,
  },

  '.simplebar-track.simplebar-vertical .simplebar-scrollbar:before': {
    top: 2,
    bottom: 2,
  },

  '.simplebar-track.simplebar-horizontal': {
    left: 0,
    height: 10,
    bottom: 0,
  },

  '.simplebar-track.simplebar-horizontal .simplebar-scrollbar:before': {
    height: '100%',
    left: 2,
    right: 2,
  },

  '.simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    right: 'auto',
    left: 0,
    top: 2,
    height: 6,
    minHeight: 0,
    minWidth: 10,
    width: 'auto',
  },

  /* Rtl support */
  '[data-simplebar-direction="rtl"] .simplebar-track.simplebar-vertical': {
    right: 'auto',
    left: 0,
  },

  '.hs-dummy-scrollbar-size': {
    direction: 'rtl',
    position: 'fixed',
    opacity: 0,
    visibility: 'hidden',
    height: 500,
    width: 500,
    overflowY: 'hidden',
    overflowX: 'scroll',
  },
});
