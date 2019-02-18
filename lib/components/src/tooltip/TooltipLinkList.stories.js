import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import WithToolTip from './WithTooltip';

import TooltipLinkList from './TooltipLinkList';
import StoryLinkWrapper from '../StoryLinkWrapper';

export const links = [
  { id: '1', title: 'Link', href: 'http://google.com' },
  { id: '2', title: 'Link', href: 'http://google.com' },
  { id: '3', title: 'callback', onClick: action('onClick') },
];

storiesOf('basics/Tooltip/TooltipLinkList', module)
  .addDecorator(storyFn => (
    <div style={{ height: '300px' }}>
      <WithToolTip placement="top" trigger="click" tooltipShown tooltip={storyFn()}>
        <div>Tooltip</div>
      </WithToolTip>
    </div>
  ))
  .add('links', () => <TooltipLinkList links={links.slice(0, 2)} LinkWrapper={StoryLinkWrapper} />)
  .add('links and callback', () => (
    <TooltipLinkList links={links} LinkWrapper={StoryLinkWrapper} />
  ));
