import { storiesOf } from '@storybook/vue';
import { withContexts } from '@storybook/addon-contexts/vue';

// Example A: Simple CSS Theming
const topLevelContexts = [
  {
    icon: 'sidebaralt',
    title: 'CSS Themes',
    components: ['div'],
    params: [
      {
        name: 'Desert',
        props: {
          style: { color: 'brown', background: '#F4A261', height: '100vh', padding: '10px' },
        },
      },
      {
        name: 'Ocean',
        props: {
          style: { color: 'white', background: '#173F5F', height: '100vh', padding: '10px' },
        },
        default: true,
      },
    ],
  },
];

const storyLevelContexts = [
  {
    title: 'CSS Themes',
    params: [
      {
        name: 'Forest',
        props: {
          style: { color: 'teal', background: '#00b894', height: '100vh', padding: '10px' },
        },
      },
    ],
  },
];

const stories = storiesOf('Addon|Contexts', module).addDecorator(withContexts(topLevelContexts));

stories.add(
  'Simple CSS Theming',
  () => ({
    template:
      "<span>I'm a children of the injected 'div' (where provides a theming context).</span>",
  }),
  {
    contexts: storyLevelContexts,
  }
);

// Example B: Language (Vue provide/inject API)
const createContext = initialValue => {
  const uid = `_${Date.now()}${Math.random()}`;
  return {
    Provider: {
      name: `Context.Provider`,
      props: ['value'],
      provide() {
        return this.value === undefined
          ? undefined
          : {
              [uid]: () => this.value,
            };
      },
      template: `
        <div>
          <slot />
        </div>
      `,
    },
    Consumer: {
      name: `Context.Consumer`,
      inject: {
        [uid]: {
          default: () => () =>
            initialValue instanceof Object ? { ...initialValue } : { value: initialValue },
        },
      },
      computed: {
        value() {
          return this[uid]();
        },
      },
      template: `
        <div>
          <slot v-bind="value" />
        </div>
      `,
    },
  };
};

const NaiveIntlContext = createContext({
  locale: 'unknown',
  greeting: 'NULL',
});

stories.add(
  'Languages',
  () => ({
    components: { 'NaiveIntlContext.Consumer': NaiveIntlContext.Consumer },
    template: `
      <NaiveIntlContext.Consumer v-slot="{ locale, greeting }">
        Your locale is {{ locale }}, so I say {{ greeting }}!
      </NaiveIntlContext.Consumer>
    `,
  }),
  {
    contexts: [
      {
        icon: 'globe',
        title: 'Languages',
        components: [NaiveIntlContext.Provider],
        params: [
          {
            name: 'English',
            props: {
              value: { locale: 'en', greeting: 'Hello' },
            },
          },
          {
            name: 'French',
            props: {
              value: { locale: 'fr', greeting: 'Bonjour' },
            },
          },
          {
            name: 'Chinese',
            props: {
              value: { locale: 'cn', greeting: '你好' },
            },
          },
        ],
        options: {
          cancelable: true,
        },
      },
    ],
  }
);
