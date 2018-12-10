import { storiesOf } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

storiesOf('Addon|Notes', module)
  .add(
    'Simple note',
    () => ({
      component: Button,
      props: {
        text: 'Notes on some Button',
        onClick: () => {},
      },
    }),
    { notes: 'My notes on some button' }
  )
  .add(
    'Note with HTML',
    () => ({
      component: Button,
      props: {
        text: 'Notes with HTML',
        onClick: () => {},
      },
    }),
    {
      notes: `
      <h2>My notes on emojis</h2>

      <em>It's not all that important to be honest, but..</em>

      Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
    `,
    }
  );
