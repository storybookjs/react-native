import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TokenComponent, ITEMS, DEFAULT_NAME } from './moduleMetadata/token.component';
import { CustomPipePipe } from './moduleMetadata/custom.pipe';

storiesOf('Metadata|Combined', module)
  .addDecorator(
    moduleMetadata({
      imports: [],
      declarations: [TokenComponent],
      providers: [
        {
          provide: ITEMS,
          useValue: ['Joe', 'Jane'],
        },
        {
          provide: DEFAULT_NAME,
          useValue: 'Provider Name',
        },
      ],
    })
  )
  .add('Combined 1', () => ({
    template: `<storybook-simple-token-component [name]="name"></storybook-simple-token-component>`,
    props: {
      name: 'Prop Name',
    },
  }))
  .add('Combined 2', () => ({
    template: `<storybook-simple-token-component [name]="name | customPipe"></storybook-simple-token-component>`,
    props: {
      name: 'Prop Name',
    },
    moduleMetadata: {
      declarations: [CustomPipePipe],
    },
  }));
