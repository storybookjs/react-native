import { h } from 'preact';

import { storiesOf } from '@storybook/preact';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import centered from '@storybook/addon-centered';
// import { Button } from '@storybook/preact/demo';

import App from '../App';
import Container from './Container';

const Button = ({ children, ...props }) => <button {...props}>{children}</button>;

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
  );

storiesOf('App', module).add('full app', () => <App />);

storiesOf('Some really long story kind description', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);
