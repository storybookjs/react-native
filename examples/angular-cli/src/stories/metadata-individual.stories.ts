import { TokenComponent, ITEMS, DEFAULT_NAME } from './moduleMetadata/token.component';

export default {
  title: 'Metadata/Individual',
};

export const Individual1 = () => ({
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
});

Individual1.story = {
  name: 'Individual 1',
};

export const Individual2 = () => ({
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
});

Individual2.story = {
  name: 'Individual 2',
};
