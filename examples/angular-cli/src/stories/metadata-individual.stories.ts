import { storiesOf } from '@storybook/angular';
import { TokenComponent, ITEMS, DEFAULT_NAME } from './moduleMetadata/token.component';

storiesOf('Metadata|Individual', module)
  .add('Individual 1', () => ({
    template: `<storybook-simple-token-component [name]="name"></storybook-simple-token-component>`,
    props: {
      name: 'Prop Name',
    },
    moduleMetadata: {
      imports: [],
      declarations: [TokenComponent],
      providers: [
        {
          provide: ITEMS,
          useValue: ['Joe', 'Jane'],
        },
      ],
    },
  }))
  .add('Individual 2', () => ({
    template: `<storybook-simple-token-component></storybook-simple-token-component>`,
    moduleMetadata: {
      imports: [],
      declarations: [TokenComponent],
      providers: [
        {
          provide: ITEMS,
          useValue: ['Jim', 'Jill'],
        },
        {
          provide: DEFAULT_NAME,
          useValue: 'Provider Name',
        },
      ],
    },
  }));
