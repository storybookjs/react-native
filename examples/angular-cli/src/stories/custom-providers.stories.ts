import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs/angular';

import { DummyService } from './moduleMetadata/dummy.service';
import { ServiceComponent } from './moduleMetadata/service.component';

storiesOf('Custom|Providers', module)
  .add('Simple', () => ({
    component: ServiceComponent,
    props: {
      name: 'Static name',
    },
    moduleMetadata: {
      imports: [],
      schemas: [],
      declarations: [],
      providers: [DummyService],
    },
  }))
  .addDecorator(withKnobs)
  .add('With knobs', () => {
    const name = text('name', 'Dynamic knob');

    return {
      component: ServiceComponent,
      props: {
        name,
      },
      moduleMetadata: {
        imports: [],
        schemas: [],
        declarations: [],
        providers: [DummyService],
      },
    };
  });
