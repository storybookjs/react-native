import React from 'react';
import { storiesOf } from '@storybook/react';

import Alert from './alert';

storiesOf('Components|Alert', module)
  .add('success', () => <Alert type="success">You did everything correctly!</Alert>)
  .add('warn', () => <Alert type="warn">Just want to mention, it's not perfect.</Alert>)
  .add('fail', () => <Alert type="fail">Computer says no.</Alert>)
  .add('custom', () => <Alert type="hotpink">Computer says I love you.</Alert>)
  .add('with icon', () => (
    <Alert type="fail" icon="⚠️">
      It's bad.
    </Alert>
  ))
  .add('long text', () => (
    <Alert type="warn" icon="☠️">
      Nulla facilisi. Nullam vitae nunc nibh. Vivamus massa felis, hendrerit imperdiet sollicitudin
      consequat, pulvinar nec felis. Curabitur semper eu metus non pulvinar. Donec quis laoreet
      velit. Nullam molestie gravida cursus. Vestibulum ullamcorper neque a nisi pellentesque
      pulvinar. Proin tristique at nunc non venenatis. Fusce vitae dictum justo.
    </Alert>
  ));
