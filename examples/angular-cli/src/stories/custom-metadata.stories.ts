import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs/angular';

import { NameComponent } from './name.component';
import { CustomPipePipe } from './custom.pipe';
import { DummyService } from './moduleMetadata/dummy.service';
import { ServiceComponent } from './moduleMetadata/service.component';

storiesOf('Custom Pipe', module).add('Default', () => ({
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
}));

storiesOf('Custom Pipe/With Knobs', module)
  .addDecorator(withKnobs)
  .add('NameComponent', () => ({
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

storiesOf('Custom ngModule metadata', module)
  .add('simple', () => ({
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
  .add('with knobs', () => {
    const name = text('Name', 'Dynamic knob');

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
