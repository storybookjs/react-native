import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Link } from './link';
import { Icons } from '../../icon/icon';

const onClick = action('onClick');
storiesOf('Basics|Link', module)
  .add('cancel w/ onClick', () => (
    <Link cancel href="/" onClick={onClick}>
      Try clicking with different mouse buttons and modifier keys (shift/ctrl/alt/cmd)
    </Link>
  ))
  .add('cancel w/ href', () => (
    <Link cancel href="http://example.com">
      Link
    </Link>
  ))
  .add('no-cancel w/ onClick', () => (
    <Link href="/" onClick={onClick}>
      any click will go through
    </Link>
  ))
  .add('no-cancel w/ href', () => (
    <Link cancel href="http://example.com">
      Link
    </Link>
  ))
  .add('styled links', () => (
    <div>
      <Link href="http://google.com">Default</Link>
      <br />
      <Link secondary href="http://google.com">
        Secondary
      </Link>
      <br />
      <Link tertiary href="http://google.com">
        tertiary
      </Link>
      <br />
      <Link nochrome href="http://google.com">
        nochrome
      </Link>
      <br />
      <Link href="http://google.com">
        <Icons icon="discord" />
        With icon in front
      </Link>
      <br />
      <Link containsIcon href="http://google.com">
        {/* A linked icon by itself   */}
        <Icons icon="sidebar" />
      </Link>
      <br />
      <Link containsIcon withArrow href="http://google.com">
        With arrow behind
      </Link>
      <br />
      <span style={{ background: '#333' }}>
        <Link inverse href="http://google.com">
          Inverted colors
        </Link>
      </span>
      <br />
    </div>
  ));
