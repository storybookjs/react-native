import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs/angular';

import { NameComponent } from './moduleMetadata/name.component';
import { CustomPipePipe } from './moduleMetadata/custom.pipe';
import { moduleMetadata } from '@storybook/angular';

storiesOf('Custom|Pipes', module)
  .addDecorator(
    moduleMetadata({
      imports: [],
      schemas: [],
      declarations: [CustomPipePipe],
      providers: [],
    })
  )
  .add('Simple', () => ({
    component: NameComponent,
    props: {
      field: 'foobar',
    },
  }))
  .addDecorator(withKnobs)
  .add('With Knobs', () => ({
    component: NameComponent,
    props: {
      field: text('field', 'foobar'),
    },
  }));
