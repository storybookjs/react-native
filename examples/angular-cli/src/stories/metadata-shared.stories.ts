import { moduleMetadata } from '@storybook/angular';
import { TokenComponent, ITEMS, DEFAULT_NAME } from './moduleMetadata/token.component';

export default {
  title: 'Metadata/Shared',
  decorators: [
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
    }),
  ],
};

export const shared1 = () => ({
  template: `<storybook-simple-token-component [name]="name"></storybook-simple-token-component>`,
  props: {
    name: 'Prop Name',
  },
});

shared1.story = {
  name: 'Shared 1',
};

export const shared2 = () => ({
  template: `<storybook-simple-token-component></storybook-simple-token-component>`,
});

shared2.story = {
  name: 'Shared 2',
};
