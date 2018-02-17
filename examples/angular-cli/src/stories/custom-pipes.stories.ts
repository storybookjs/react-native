import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs/angular';

import { NameComponent } from './moduleMetadata/name.component';
import { CustomPipePipe } from './moduleMetadata/custom.pipe';

storiesOf('Custom|Pipes', module)
  .add('Simple', () => ({
    component: NameComponent,
    props: {
      field: 'foobar',
    },
    moduleMetadata: {
      imports: [],
      schemas: [],
      declarations: [CustomPipePipe],
      providers: [],
    },
  }))
  .addDecorator(withKnobs)
  .add('With Knobs', () => ({
    component: NameComponent,
    props: {
      field: text('field', 'foobar'),
    },
    moduleMetadata: {
      imports: [],
      schemas: [],
      declarations: [CustomPipePipe],
      providers: [],
    },
  }));
