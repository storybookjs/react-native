import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs';

import { NameComponent } from './moduleMetadata/name.component';
import { CustomPipePipe } from './moduleMetadata/custom.pipe';

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
  .add(
    'With Knobs',
    () => ({
      component: NameComponent,
      props: {
        field: text('field', 'foobar'),
      },
    }),
    {
      decorators: [withKnobs],
    }
  );
