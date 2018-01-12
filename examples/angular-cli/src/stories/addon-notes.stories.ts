import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { Button } from '@storybook/angular/demo';

storiesOf('Addon Notes', module)
  .add(
    'Simple note',
    withNotes({ text: 'My notes on some button' })(() => ({
      component: Button,
      props: {
        text: 'Notes on some Button',
        onClick: () => {},
      },
    }))
  )
  .add(
    'Note with HTML',
    withNotes({
      text: `
      <h2>My notes on emojis</h2>

      <em>It's not all that important to be honest, but..</em>

      Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
    `,
    })(() => ({
      component: Button,
      props: {
        text: 'Notes with HTML',
        onClick: () => {},
      },
    }))
  );
