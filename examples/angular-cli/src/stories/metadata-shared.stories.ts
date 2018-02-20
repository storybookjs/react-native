import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TokenComponent, ITEMS, DEFAULT_NAME } from './moduleMetadata/token.component';

storiesOf('Metadata|Shared', module)
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
  .add('Shared 1', () => ({
    template: `<storybook-simple-token-component [name]="name"></storybook-simple-token-component>`,
    props: {
      name: 'Prop Name',
    },
  }))
  .add('Shared 2', () => ({
    template: `<storybook-simple-token-component></storybook-simple-token-component>`,
  }));
