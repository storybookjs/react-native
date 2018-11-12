import React from 'react';

import { storiesOf } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import centered from '@storybook/addon-centered';
import { withInfo } from '@storybook/addon-info';
import { Button } from '@storybook/react/demo';

// eslint-disable-next-line import/extensions,import/no-unresolved
import App from 'App';
import Container from './Container';
import LifecycleLogger from '../components/LifecycleLogger';

const InfoButton = () => (
  <span
    style={{
      fontFamily: 'sans-serif',
      fontSize: 12,
      textDecoration: 'none',
      background: 'rgb(34, 136, 204)',
      color: 'rgb(255, 255, 255)',
      padding: '5px 15px',
      margin: 10,
      borderRadius: '0px 0px 0px 5px',
    }}
  >
    {' '}
    Show Info{' '}
  </span>
);

storiesOf('Button', module)
  .addDecorator(withNotes)
  .add('with text', () => (
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      Hello Button
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ))
  .add(
    'with notes',
    () => (
      <Button>
        {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
        Check my notes in the notes panel
      </Button>
    ),
    { notes: 'A very simple button' }
  )
  .add(
    'with new info',
    withInfo(
      'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.'
    )(context => (
      <Container>
        {setOptions({ selectedAddonPanel: 'storybook/info/info-panel' })}
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    ))
  )
  .add(
    'addons composition',
    withInfo('see Notes panel for composition info')(
      withNotes('Composition: Info(Notes())')(context => (
        <div>
          {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
          click the <InfoButton /> label in top right for info about "{context.story}"
        </div>
      ))
    )
  );

storiesOf('App', module).add('full app', () => <App />);

storiesOf('Some really long story kind description', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('Lifecycle', module).add('logging', () => <LifecycleLogger />);
