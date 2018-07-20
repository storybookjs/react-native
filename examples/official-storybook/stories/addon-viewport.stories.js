import React from 'react';
import { storiesOf } from '@storybook/react';

import styled from 'react-emotion';

import { Viewport, withViewport } from '@storybook/addon-viewport';
import EventEmitter from 'eventemitter3';

import Logger from './Logger';

const Panel = styled('div')();

storiesOf('Addons|Viewport', module).add('default', () => (
  <Panel>I don't have problems being rendered using the default viewport.</Panel>
));

storiesOf('Addons|Viewport.Custom Default (Kindle Fire 2)', module)
  .addDecorator(withViewport('kindleFire2'))
  .add('Inherited', () => (
    <Panel>
      I've inherited <b>Kindle Fire 2</b> viewport from my parent.
    </Panel>
  ))
  .add(
    'Overridden via "withViewport" parameterized decorator',
    () => (
      <Panel>
        I respect my parents but I should be looking good on <b>iPad</b>.
      </Panel>
    ),
    { viewport: 'ipad' }
  );

const emitter = new EventEmitter();

storiesOf('Addons|Viewport.withViewport', module)
  .addDecorator(
    withViewport({
      onViewportChange({ viewport }) {
        emitter.emit(Logger.LOG_EVENT, {
          name: 'Viewport Changed',
          payload: `${viewport.name} (${viewport.type})`,
        });
      },
    })
  )
  .add('onViewportChange', () => <Logger title="Select device/viewport" emitter={emitter} />);

storiesOf('Addons|Viewport.deprecated', module)
  .addDecorator(withViewport('kindleFire2'))
  .add(
    'Overridden via "withViewport" decorator',
    withViewport('iphone6')(() => (
      <Panel>
        I respect my parents but I should be looking good on <b>iPhone 6</b>.
      </Panel>
    ))
  )
  .add('Overridden via "Viewport" component', () => (
    <Viewport name="iphone6p">
      <Panel>
        I respect my parents but I should be looking good on <b>iPhone 6 Plus</b>.
      </Panel>
    </Viewport>
  ));
