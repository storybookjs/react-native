import React from 'react';
import { styled } from '@storybook/theming';
import { ScrollArea } from './ScrollArea';

const lipsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus congue, nulla sed consectetur ornare, nibh dui accumsan risus, vel ullamcorper elit ipsum eget libero. Aenean dictum nisi a rutrum convallis. Nullam id viverra diam. Vivamus ut augue eget urna commodo vulputate. Donec ullamcorper lectus a nulla malesuada, eget suscipit dui molestie. Suspendisse ac nulla in mi dignissim ornare id quis est. Morbi ut condimentum lorem, eu porta mi. Proin lacinia ac neque ultricies dictum. Mauris placerat ornare bibendum. Fusce porttitor quis ante ac consectetur. Sed finibus eu magna eu sollicitudin. Vivamus tellus tortor, tincidunt sed arcu tempus, suscipit feugiat est. Ut sit amet libero eget odio euismod tempor et nec velit.';

const CustomScrollArea = styled(ScrollArea)({
  '.simplebar-scrollbar:before': {
    background: 'purple',
  },
  '.simplebar-track.simplebar-vertical': {
    right: '20px',
  },
});

export default {
  component: ScrollArea,
  title: 'Basics|ScrollArea',
  decorators: [
    storyFn => (
      <div
        style={{
          width: 240,
          height: 240,
          overflow: 'auto',
          background: 'papayawhip',
          margin: '1rem',
        }}
      >
        {storyFn()}
      </div>
    ),
  ],
};

export const vertical = () => (
  <ScrollArea
    // For story visual testing only
    // Remove before adding to your UI
    data-simplebar-force-visible
    data-simplebar-auto-hide="false"
  >
    <b>VERTICAL</b> {lipsum}
  </ScrollArea>
);

export const horizontal = () => (
  <ScrollArea
    // For story visual testing only
    // Remove before adding to your UI
    data-simplebar-force-visible
    data-simplebar-auto-hide="false"
  >
    <b>HORIZONTAL</b>
    <span style={{ whiteSpace: 'nowrap' }}>{lipsum}</span>
  </ScrollArea>
);

export const verticalCustomStyling = () => (
  <CustomScrollArea
    // For story visual testing only
    // Remove before adding to your UI
    data-simplebar-force-visible
    data-simplebar-auto-hide="false"
  >
    <b>VERTICAL CUSTOM STYLING</b>
    {lipsum}
  </CustomScrollArea>
);
