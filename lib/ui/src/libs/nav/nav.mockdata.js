export const mockdata = {
  input: [
    {
      kind: 'UI|ShortcutHelp',
      stories: ['default'],
    },
    {
      kind: 'Components|AddonPanel',
      stories: ['default', 'no panels'],
    },
    {
      kind: 'Components|Alert',
      stories: ['success', 'warn', 'fail', 'custom', 'with icon', 'long text'],
    },
    {
      kind: 'UI|MenuItem',
      stories: ['default'],
    },
    {
      kind: 'UI|SearchBox',
      stories: ['default', 'with stories'],
    },
    {
      kind: 'UI|stories/TextFilter',
      stories: ['without filterText', 'with filterText'],
    },
    {
      kind: 'Components|Form/Select',
      stories: ['sizes', 'validations'],
    },
    {
      kind: 'Components|Form/Button',
      stories: ['with knobs', 'sizes', 'validations', 'alignment'],
    },
    {
      kind: 'Components|Form/Textarea',
      stories: ['with knobs (controlled)', 'sizes', 'validations', 'alignment'],
    },
    {
      kind: 'Components|Grid',
      stories: ['row', 'row outer', 'row multiply', 'col', 'col outer'],
    },
    {
      kind: 'Components|Header',
      stories: ['simple'],
    },
    {
      kind: 'Components|Heading',
      stories: ['types'],
    },
    {
      kind: 'Components|Layout',
      stories: [
        'default',
        'mobile',
        'full screen',
        'no stories panel',
        'no addon panel',
        'addon panel in right',
      ],
    },
    {
      kind: 'Components|Logo',
      stories: ['gray', 'colored'],
    },
    {
      kind: 'Components|Nav',
      stories: ['default'],
    },
    {
      kind: 'Components|Navigation/MenuLink',
      stories: ['default', 'active', 'with knobs'],
    },
    {
      kind: 'Components|Navigation/RoutedLink',
      stories: ['w/ onClick', 'w/ href'],
    },
    {
      kind: 'Components|PanelActionBar',
      stories: ['single item', '3 items'],
    },
    {
      kind: 'Components|Preview',
      stories: ['default'],
    },
    {
      kind: 'Components|Root',
      stories: [
        'default options',
        'full',
        'nav',
        'panel',
        'panel gone',
        'active 0 (mobile)',
        'active 1 (mobile)',
        'active 2 (mobile)',
      ],
    },
    {
      kind: 'Components|Tabs',
      stories: [
        'stateful - static',
        'stateful - dynamic',
        'stateful - no initial',
        'stateless - bordered',
        'stateless - absolute',
        'stateless - empty',
      ],
    },
    {
      kind: 'Components|Treeview',
      stories: ['stateless', 'stateful', 'with custom node'],
    },
    {
      kind: 'Addons|a11y',
      stories: ['Default', 'Label', 'Disabled', 'Invalid contrast', 'delayed render'],
    },
    {
      kind: 'Addons|a11y/Button',
      stories: ['Default', 'Content', 'Label', 'Disabled', 'Invalid contrast'],
    },
    {
      kind: 'Addons|a11y/Form',
      stories: ['Without Label', 'With label', 'With placeholder'],
    },
    {
      kind: 'Addons|a11y/Image',
      stories: ['Without alt', 'With alt', 'Presentation'],
    },
    {
      kind: 'Addons|a11y/Typography',
      stories: ['Correct', 'Empty Heading', 'Empty Paragraph', 'Empty Link', 'Link without href'],
    },
    {
      kind: 'Addons|Actions',
      stories: [
        'Hello World',
        'Multiple actions',
        'Multiple actions + config',
        'Multiple actions, object',
        'Multiple actions, object + config',
        'Decorated action',
        'Decorated action + config',
        'Decorated actions',
        'Decorated actions + config',
        'Circular Payload',
        'Function Name',
        'Reserved keyword as name',
        'All types',
        'configureActionsDepth',
        'Persisting the action logger',
        'Limit Action Output',
      ],
    },
    {
      kind: 'Addons|Actions.deprecated',
      stories: ['Decorated Action'],
    },
    {
      kind: 'Addons|Backgrounds',
      stories: ['story 1', 'story 2', 'overriden', 'disabled via []', 'skipped via disable:true'],
    },
    {
      kind: 'Addons|Backgrounds.deprecated',
      stories: ['story 1', 'story 2', 'overriden'],
    },
    {
      kind: 'Addons|Centered',
      stories: ['story 1'],
    },
    {
      kind: 'Addons|Events',
      stories: ['Logger'],
    },
    {
      kind: 'Addons|Events.deprecated',
      stories: ['Logger'],
    },
    {
      kind: 'Addons|Info.React Docgen',
      stories: [
        'Comments from PropType declarations',
        'Comments from Flow declarations',
        'Comments from component declaration',
        'Comments from named export component declaration',
      ],
    },
    {
      kind: 'Addons|Info.Markdown',
      stories: [
        'Displays Markdown in description',
        'From internal Markdown file',
        'From external Markdown file',
      ],
    },
    {
      kind: 'Addons|Info.JSX',
      stories: ['Displays JSX in description'],
    },
    {
      kind: 'Addons|Info.Options.inline',
      stories: ['Inlines component inside story'],
    },
    {
      kind: 'Addons|Info.Options.excludedPropTypes',
      stories: ['Excludes propTypes that are in the excludedPropTypes array'],
    },
    {
      kind: 'Addons|Info.Options.header',
      stories: ['Shows or hides Info Addon header'],
    },
    {
      kind: 'Addons|Info.Options.source',
      stories: ['Shows or hides Info Addon source'],
    },
    {
      kind: 'Addons|Info.Options.propTables',
      stories: ['Shows additional component prop tables'],
    },
    {
      kind: 'Addons|Info.Options.propTablesExclude',
      stories: ['Exclude component from prop tables'],
    },
    {
      kind: 'Addons|Info.Options.styles',
      stories: ['Extend info styles with an object', 'Full control over styles using a function'],
    },
    {
      kind: 'Addons|Info.Options.TableComponent',
      stories: ['Use a custom component for the table'],
    },
    {
      kind: 'Addons|Info.Decorator',
      stories: ['Use Info as story decorator'],
    },
    {
      kind: 'Addons|Info.GitHub issues',
      stories: ['#1814'],
    },
    {
      kind: 'Addons|Info.Options.maxPropsIntoLine === 0',
      stories: ['Object and array props are broken to lines'],
    },
    {
      kind: 'Addons|Info.Options.maxPropsIntoLine === 3',
      stories: ['Object and array props are broken to lines'],
    },
    {
      kind: 'Addons|Info.Parameters',
      stories: [
        'Using paramaters across all stories',
        'Overwriting and extending the parameters and options set stories-wise',
        'Overwrite the parameters with markdown variable',
        'Overwrite the text parameter with markdown inline',
        'Disable the addon entirely',
      ],
    },
    {
      kind: 'Addons|Info.deprecated',
      stories: ['Displays Markdown in description'],
    },
    {
      kind: 'Addons|jest',
      stories: ['withTests'],
    },
    {
      kind: 'Addons|Knobs.withKnobs',
      stories: [
        'tweaks static values',
        'tweaks static values organized in groups',
        'dynamic knobs',
        'triggers actions via button',
        'XSS safety',
        'accepts story parameters',
      ],
    },
    {
      kind: 'Addons|Knobs.withKnobs using options',
      stories: ['accepts options'],
    },
    {
      kind: 'Addons|Knobs.withKnobsOptions',
      stories: ['displays HTML code'],
    },
    {
      kind: 'Addons|Links.Link',
      stories: ['First', 'Second'],
    },
    {
      kind: 'Addons|Links.Button',
      stories: ['First', 'Second'],
    },
    {
      kind: 'Addons|Links.Select',
      stories: ['Index', 'First', 'Second', 'Third'],
    },
    {
      kind: 'Addons|Links.Href',
      stories: ['log'],
    },
    {
      kind: 'Addons|Links.Scroll position',
      stories: ['First', 'Second'],
    },
    {
      kind: 'Addons|Notes',
      stories: [
        'withNotes',
        'withNotes rendering imported markdown',
        'withNotes rendering inline, github-flavored markdown',
        'with a markdown table',
      ],
    },
    {
      kind: 'Addons|Notes.deprecated',
      stories: [
        'using decorator arguments, withNotes',
        'using decorator arguments, withMarkdownNotes',
      ],
    },
    {
      kind: 'Addons|Storyshots',
      stories: ['text', 'table'],
    },
    {
      kind: 'Addons|Viewport',
      stories: ['default'],
    },
    {
      kind: 'Addons|Viewport.Custom Default (Kindle Fire 2)',
      stories: ['Inherited', 'Overridden via "withViewport" parameterized decorator'],
    },
    {
      kind: 'Addons|Viewport.withViewport',
      stories: ['onViewportChange'],
    },
    {
      kind: 'Addons|Viewport.deprecated',
      stories: ['Overridden via "withViewport" decorator', 'Overridden via "Viewport" component'],
    },
    {
      kind: 'App|acceptance',
      stories: [
        'cra-kitchen-sink',
        'vue-kitchen-sink',
        'svelte-kitchen-sink',
        'angular-cli',
        'polymer-cli',
        'mithril-kitchen-sink',
        'html-kitchen-sink',
      ],
    },
    {
      kind: 'Core|Parameters',
      stories: ['passed to story'],
    },
    {
      kind: 'Core|Events',
      stories: ['Force re-render'],
    },
    {
      kind: 'Other|/stories//Dirname Example',
      stories: ['story 1', 'story 2'],
    },
  ],
};
