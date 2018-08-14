export const mockdata = {
  input: [
    {
      id: 1,
      name: 'Parent A',
      isExpanded: true,
      children: [
        {
          id: 11,
          name: 'Child A1',
          isSelected: true,
        },
        {
          id: 12,
          name: 'Child A2',
          isExpanded: false,
          children: [
            {
              id: 121,
              name: 'GrandChild A1.1',
            },
            {
              id: 122,
              name: 'GrandChild A1.2',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Parent B',
      isExpanded: true,
      isSelected: true,
      children: [
        {
          id: 21,
          name: 'Child B1',
        },
        {
          id: 22,
          name: 'Child B2',
        },
      ],
    },
  ],
  dataset: {
    '1': {
      id: 1,
      name: 'Parent A',
      isExpanded: true,
      children: ['1-11', '1-12'],
      path: '1',
      pid: '',
    },
    '2': {
      id: 2,
      name: 'Parent B',
      isExpanded: true,
      isSelected: true,
      children: ['2-21', '2-22'],
      path: '2',
      pid: '',
    },
    root: ['1', '2'],
    '1-11': {
      id: 11,
      name: 'Child A1',
      isSelected: true,
      path: '1-11',
      pid: '1',
    },
    '1-12-121': {
      id: 121,
      name: 'GrandChild A1.1',
      path: '1-12-121',
      pid: '1-12',
    },
    '1-12-122': {
      id: 122,
      name: 'GrandChild A1.2',
      path: '1-12-122',
      pid: '1-12',
    },
    '1-12': {
      id: 12,
      name: 'Child A2',
      isExpanded: false,
      children: ['1-12-121', '1-12-122'],
      path: '1-12',
      pid: '1',
    },
    '2-21': {
      id: 21,
      name: 'Child B1',
      path: '2-21',
      pid: '2',
    },
    '2-22': {
      id: 22,
      name: 'Child B2',
      path: '2-22',
      pid: '2',
    },
  },
  nested: [
    {
      id: 1,
      name: 'Parent A',
      isExpanded: true,
      children: [
        {
          id: 11,
          name: 'Child A1',
          isSelected: true,
          path: '1-11',
          pid: '1',
          depth: 1,
        },
        {
          id: 12,
          name: 'Child A2',
          isExpanded: false,
          children: [
            {
              id: 121,
              name: 'GrandChild A1.1',
              path: '1-12-121',
              pid: '1-12',
              depth: 2,
            },
            {
              id: 122,
              name: 'GrandChild A1.2',
              path: '1-12-122',
              pid: '1-12',
              depth: 2,
            },
          ],
          path: '1-12',
          pid: '1',
          depth: 1,
        },
      ],
      path: '1',
      pid: '',
      depth: 0,
    },
    {
      id: 2,
      name: 'Parent B',
      isExpanded: true,
      isSelected: true,
      children: [
        {
          id: 21,
          name: 'Child B1',
          path: '2-21',
          pid: '2',
          depth: 1,
        },
        {
          id: 22,
          name: 'Child B2',
          path: '2-22',
          pid: '2',
          depth: 1,
        },
      ],
      path: '2',
      pid: '',
      depth: 0,
    },
  ],
};

export const storybook = [
  {
    name: 'UI',
    id: 'ui',
    children: [
      {
        name: 'ShortcutHelp',
        id: 'shortcutHelp',
        children: [
          {
            name: 'default',
            id: 'default',
          },
        ],
      },
      {
        name: 'MenuItem',
        id: 'menuItem',
        children: [
          {
            name: 'default',
            id: 'default',
          },
        ],
      },
      {
        name: 'SearchBox',
        id: 'searchBox',
        children: [
          {
            name: 'default',
            id: 'default',
          },
          {
            name: 'with stories',
            id: 'withStories',
          },
        ],
      },
      {
        name: 'stories',
        id: 'stories',
        children: [
          {
            name: 'TextFilter',
            id: 'textFilter',
            children: [
              {
                name: 'without filterText',
                id: 'withoutFiltertext',
              },
              {
                name: 'with filterText',
                id: 'withFiltertext',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Components',
    id: 'components',
    children: [
      {
        name: 'AddonPanel',
        id: 'addonPanel',
        children: [
          {
            name: 'default',
            id: 'default',
          },
          {
            name: 'no panels',
            id: 'noPanels',
          },
        ],
      },
      {
        name: 'Alert',
        id: 'alert',
        children: [
          {
            name: 'success',
            id: 'success',
          },
          {
            name: 'warn',
            id: 'warn',
          },
          {
            name: 'fail',
            id: 'fail',
          },
          {
            name: 'custom',
            id: 'custom',
          },
          {
            name: 'with icon',
            id: 'withIcon',
          },
          {
            name: 'long text',
            id: 'longText',
          },
        ],
      },
      {
        name: 'Form',
        id: 'form',
        children: [
          {
            name: 'Select',
            id: 'select',
            children: [
              {
                name: 'sizes',
                id: 'sizes',
              },
              {
                name: 'validations',
                id: 'validations',
              },
            ],
          },
          {
            name: 'Button',
            id: 'button',
            children: [
              {
                name: 'with knobs',
                id: 'withKnobs',
              },
              {
                name: 'sizes',
                id: 'sizes',
              },
              {
                name: 'validations',
                id: 'validations',
              },
              {
                name: 'alignment',
                id: 'alignment',
              },
            ],
          },
          {
            name: 'Textarea',
            id: 'textarea',
            children: [
              {
                name: 'with knobs (controlled)',
                id: 'withKnobsControlled',
              },
              {
                name: 'sizes',
                id: 'sizes',
              },
              {
                name: 'validations',
                id: 'validations',
              },
              {
                name: 'alignment',
                id: 'alignment',
              },
            ],
          },
        ],
      },
      {
        name: 'Grid',
        id: 'grid',
        children: [
          {
            name: 'row',
            id: 'row',
          },
          {
            name: 'row outer',
            id: 'rowOuter',
          },
          {
            name: 'row multiply',
            id: 'rowMultiply',
          },
          {
            name: 'col',
            id: 'col',
          },
          {
            name: 'col outer',
            id: 'colOuter',
          },
        ],
      },
      {
        name: 'Header',
        id: 'header',
        children: [
          {
            name: 'simple',
            id: 'simple',
          },
        ],
      },
      {
        name: 'Heading',
        id: 'heading',
        children: [
          {
            name: 'types',
            id: 'types',
          },
        ],
      },
      {
        name: 'Layout',
        id: 'layout',
        children: [
          {
            name: 'default',
            id: 'default',
          },
          {
            name: 'mobile',
            id: 'mobile',
          },
          {
            name: 'full screen',
            id: 'fullScreen',
          },
          {
            name: 'no stories panel',
            id: 'noStoriesPanel',
          },
          {
            name: 'no addon panel',
            id: 'noAddonPanel',
          },
          {
            name: 'addon panel in right',
            id: 'addonPanelInRight',
          },
        ],
      },
      {
        name: 'Logo',
        id: 'logo',
        children: [
          {
            name: 'gray',
            id: 'gray',
          },
          {
            name: 'colored',
            id: 'colored',
          },
        ],
      },
      {
        name: 'Nav',
        id: 'nav',
        children: [
          {
            name: 'default',
            id: 'default',
          },
        ],
      },
      {
        name: 'Navigation',
        id: 'navigation',
        children: [
          {
            name: 'MenuLink',
            id: 'menuLink',
            children: [
              {
                name: 'default',
                id: 'default',
              },
              {
                name: 'active',
                id: 'active',
              },
              {
                name: 'with knobs',
                id: 'withKnobs',
              },
            ],
          },
          {
            name: 'RoutedLink',
            id: 'routedLink',
            children: [
              {
                name: 'w/ onClick',
                id: 'wOnclick',
              },
              {
                name: 'w/ href',
                id: 'wHref',
              },
            ],
          },
        ],
      },
      {
        name: 'PanelActionBar',
        id: 'panelActionBar',
        children: [
          {
            name: 'single item',
            id: 'singleItem',
          },
          {
            name: '3 items',
            id: '3Items',
          },
        ],
      },
      {
        name: 'Preview',
        id: 'preview',
        children: [
          {
            name: 'default',
            id: 'default',
          },
        ],
      },
      {
        name: 'Root',
        id: 'root',
        children: [
          {
            name: 'default options',
            id: 'defaultOptions',
          },
          {
            name: 'full',
            id: 'full',
          },
          {
            name: 'nav',
            id: 'nav',
          },
          {
            name: 'panel',
            id: 'panel',
          },
          {
            name: 'panel gone',
            id: 'panelGone',
          },
          {
            name: 'active 0 (mobile)',
            id: 'active0Mobile',
          },
          {
            name: 'active 1 (mobile)',
            id: 'active1Mobile',
          },
          {
            name: 'active 2 (mobile)',
            id: 'active2Mobile',
          },
        ],
      },
      {
        name: 'Tabs',
        id: 'tabs',
        children: [
          {
            name: 'stateful - static',
            id: 'statefulStatic',
          },
          {
            name: 'stateful - dynamic',
            id: 'statefulDynamic',
          },
          {
            name: 'stateful - no initial',
            id: 'statefulNoInitial',
          },
          {
            name: 'stateless - bordered',
            id: 'statelessBordered',
          },
          {
            name: 'stateless - absolute',
            id: 'statelessAbsolute',
          },
          {
            name: 'stateless - empty',
            id: 'statelessEmpty',
          },
        ],
      },
      {
        name: 'Treeview',
        id: 'treeview',
        children: [
          {
            name: 'stateless',
            id: 'stateless',
          },
          {
            name: 'stateful',
            id: 'stateful',
          },
          {
            name: 'with custom node',
            id: 'withCustomNode',
          },
        ],
      },
    ],
  },
  {
    name: 'Addons',
    id: 'addons',
    children: [
      {
        name: 'a11y',
        id: 'a11y',
        children: [
          {
            name: 'Default',
            id: 'default',
          },
          {
            name: 'Label',
            id: 'label',
          },
          {
            name: 'Disabled',
            id: 'disabled',
          },
          {
            name: 'Invalid contrast',
            id: 'invalidContrast',
          },
          {
            name: 'delayed render',
            id: 'delayedRender',
          },
          {
            name: 'Button',
            id: 'button',
            children: [
              {
                name: 'Default',
                id: 'default',
              },
              {
                name: 'Content',
                id: 'content',
              },
              {
                name: 'Label',
                id: 'label',
              },
              {
                name: 'Disabled',
                id: 'disabled',
              },
              {
                name: 'Invalid contrast',
                id: 'invalidContrast',
              },
            ],
          },
          {
            name: 'Form',
            id: 'form',
            children: [
              {
                name: 'Without Label',
                id: 'withoutLabel',
              },
              {
                name: 'With label',
                id: 'withLabel',
              },
              {
                name: 'With placeholder',
                id: 'withPlaceholder',
              },
            ],
          },
          {
            name: 'Image',
            id: 'image',
            children: [
              {
                name: 'Without alt',
                id: 'withoutAlt',
              },
              {
                name: 'With alt',
                id: 'withAlt',
              },
              {
                name: 'Presentation',
                id: 'presentation',
              },
            ],
          },
          {
            name: 'Typography',
            id: 'typography',
            children: [
              {
                name: 'Correct',
                id: 'correct',
              },
              {
                name: 'Empty Heading',
                id: 'emptyHeading',
              },
              {
                name: 'Empty Paragraph',
                id: 'emptyParagraph',
              },
              {
                name: 'Empty Link',
                id: 'emptyLink',
              },
              {
                name: 'Link without href',
                id: 'linkWithoutHref',
              },
            ],
          },
        ],
      },
      {
        name: 'Actions',
        id: 'actions',
        children: [
          {
            name: 'Hello World',
            id: 'helloWorld',
          },
          {
            name: 'Multiple actions',
            id: 'multipleActions',
          },
          {
            name: 'Multiple actions + config',
            id: 'multipleActionsConfig',
          },
          {
            name: 'Multiple actions, object',
            id: 'multipleActionsObject',
          },
          {
            name: 'Multiple actions, object + config',
            id: 'multipleActionsObjectConfig',
          },
          {
            name: 'Decorated action',
            id: 'decoratedAction',
          },
          {
            name: 'Decorated action + config',
            id: 'decoratedActionConfig',
          },
          {
            name: 'Decorated actions',
            id: 'decoratedActions',
          },
          {
            name: 'Decorated actions + config',
            id: 'decoratedActionsConfig',
          },
          {
            name: 'Circular Payload',
            id: 'circularPayload',
          },
          {
            name: 'Function Name',
            id: 'functionName',
          },
          {
            name: 'Reserved keyword as name',
            id: 'reservedKeywordAsName',
          },
          {
            name: 'All types',
            id: 'allTypes',
          },
          {
            name: 'configureActionsDepth',
            id: 'configureActionsDepth',
          },
          {
            name: 'Persisting the action logger',
            id: 'persistingTheActionLogger',
          },
          {
            name: 'Limit Action Output',
            id: 'limitActionOutput',
          },
          {
            name: 'deprecated',
            id: 'deprecated',
            children: [
              {
                name: 'Decorated Action',
                id: 'decoratedAction',
              },
            ],
          },
        ],
      },
      {
        name: 'Backgrounds',
        id: 'backgrounds',
        children: [
          {
            name: 'story 1',
            id: 'story1',
          },
          {
            name: 'story 2',
            id: 'story2',
          },
          {
            name: 'overriden',
            id: 'overriden',
          },
          {
            name: 'disabled via []',
            id: 'disabledVia',
          },
          {
            name: 'skipped via disable:true',
            id: 'skippedViaDisableTrue',
          },
          {
            name: 'deprecated',
            id: 'deprecated',
            children: [
              {
                name: 'story 1',
                id: 'story1',
              },
              {
                name: 'story 2',
                id: 'story2',
              },
              {
                name: 'overriden',
                id: 'overriden',
              },
            ],
          },
        ],
      },
      {
        name: 'Centered',
        id: 'centered',
        children: [
          {
            name: 'story 1',
            id: 'story1',
          },
        ],
      },
      {
        name: 'Events',
        id: 'events',
        children: [
          {
            name: 'Logger',
            id: 'logger',
          },
          {
            name: 'deprecated',
            id: 'deprecated',
            children: [
              {
                name: 'Logger',
                id: 'logger',
              },
            ],
          },
        ],
      },
      {
        name: 'Info',
        id: 'info',
        children: [
          {
            name: 'React Docgen',
            id: 'reactDocgen',
            children: [
              {
                name: 'Comments from PropType declarations',
                id: 'commentsFromProptypeDeclarations',
              },
              {
                name: 'Comments from Flow declarations',
                id: 'commentsFromFlowDeclarations',
              },
              {
                name: 'Comments from component declaration',
                id: 'commentsFromComponentDeclaration',
              },
              {
                name: 'Comments from named export component declaration',
                id: 'commentsFromNamedExportComponentDeclaration',
              },
            ],
          },
          {
            name: 'Markdown',
            id: 'markdown',
            children: [
              {
                name: 'Displays Markdown in description',
                id: 'displaysMarkdownInDescription',
              },
              {
                name: 'From internal Markdown file',
                id: 'fromInternalMarkdownFile',
              },
              {
                name: 'From external Markdown file',
                id: 'fromExternalMarkdownFile',
              },
            ],
          },
          {
            name: 'JSX',
            id: 'jsx',
            children: [
              {
                name: 'Displays JSX in description',
                id: 'displaysJsxInDescription',
              },
            ],
          },
          {
            name: 'Options',
            id: 'options',
            children: [
              {
                name: 'inline',
                id: 'inline',
                children: [
                  {
                    name: 'Inlines component inside story',
                    id: 'inlinesComponentInsideStory',
                  },
                ],
              },
              {
                name: 'excludedPropTypes',
                id: 'excludedPropTypes',
                children: [
                  {
                    name: 'Excludes propTypes that are in the excludedPropTypes array',
                    id: 'excludesProptypesThatAreInTheExcludedproptypesArray',
                  },
                ],
              },
              {
                name: 'header',
                id: 'header',
                children: [
                  {
                    name: 'Shows or hides Info Addon header',
                    id: 'showsOrHidesInfoAddonHeader',
                  },
                ],
              },
              {
                name: 'source',
                id: 'source',
                children: [
                  {
                    name: 'Shows or hides Info Addon source',
                    id: 'showsOrHidesInfoAddonSource',
                  },
                ],
              },
              {
                name: 'propTables',
                id: 'propTables',
                children: [
                  {
                    name: 'Shows additional component prop tables',
                    id: 'showsAdditionalComponentPropTables',
                  },
                ],
              },
              {
                name: 'propTablesExclude',
                id: 'propTablesExclude',
                children: [
                  {
                    name: 'Exclude component from prop tables',
                    id: 'excludeComponentFromPropTables',
                  },
                ],
              },
              {
                name: 'styles',
                id: 'styles',
                children: [
                  {
                    name: 'Extend info styles with an object',
                    id: 'extendInfoStylesWithAnObject',
                  },
                  {
                    name: 'Full control over styles using a function',
                    id: 'fullControlOverStylesUsingAFunction',
                  },
                ],
              },
              {
                name: 'TableComponent',
                id: 'tableComponent',
                children: [
                  {
                    name: 'Use a custom component for the table',
                    id: 'useACustomComponentForTheTable',
                  },
                ],
              },
              {
                name: 'maxPropsIntoLine === 0',
                id: 'maxpropsintoline0',
                children: [
                  {
                    name: 'Object and array props are broken to lines',
                    id: 'objectAndArrayPropsAreBrokenToLines',
                  },
                ],
              },
              {
                name: 'maxPropsIntoLine === 3',
                id: 'maxpropsintoline3',
                children: [
                  {
                    name: 'Object and array props are broken to lines',
                    id: 'objectAndArrayPropsAreBrokenToLines',
                  },
                ],
              },
            ],
          },
          {
            name: 'Decorator',
            id: 'decorator',
            children: [
              {
                name: 'Use Info as story decorator',
                id: 'useInfoAsStoryDecorator',
              },
            ],
          },
          {
            name: 'GitHub issues',
            id: 'githubIssues',
            children: [
              {
                name: '#1814',
                id: '1814',
              },
            ],
          },
          {
            name: 'Parameters',
            id: 'parameters',
            children: [
              {
                name: 'Using paramaters across all stories',
                id: 'usingParamatersAcrossAllStories',
              },
              {
                name: 'Overwriting and extending the parameters and options set stories-wise',
                id: 'overwritingAndExtendingTheParametersAndOptionsSetStoriesWise',
              },
              {
                name: 'Overwrite the parameters with markdown variable',
                id: 'overwriteTheParametersWithMarkdownVariable',
              },
              {
                name: 'Overwrite the text parameter with markdown inline',
                id: 'overwriteTheTextParameterWithMarkdownInline',
              },
              {
                name: 'Disable the addon entirely',
                id: 'disableTheAddonEntirely',
              },
            ],
          },
          {
            name: 'deprecated',
            id: 'deprecated',
            children: [
              {
                name: 'Displays Markdown in description',
                id: 'displaysMarkdownInDescription',
              },
            ],
          },
        ],
      },
      {
        name: 'jest',
        id: 'jest',
        children: [
          {
            name: 'withTests',
            id: 'withTests',
          },
        ],
      },
      {
        name: 'Knobs',
        id: 'knobs',
        children: [
          {
            name: 'withKnobs',
            id: 'withKnobs',
            children: [
              {
                name: 'tweaks static values',
                id: 'tweaksStaticValues',
              },
              {
                name: 'tweaks static values organized in groups',
                id: 'tweaksStaticValuesOrganizedInGroups',
              },
              {
                name: 'dynamic knobs',
                id: 'dynamicKnobs',
              },
              {
                name: 'triggers actions via button',
                id: 'triggersActionsViaButton',
              },
              {
                name: 'XSS safety',
                id: 'xssSafety',
              },
              {
                name: 'accepts story parameters',
                id: 'acceptsStoryParameters',
              },
            ],
          },
          {
            name: 'withKnobs using options',
            id: 'withknobsUsingOptions',
            children: [
              {
                name: 'accepts options',
                id: 'acceptsOptions',
              },
            ],
          },
          {
            name: 'withKnobsOptions',
            id: 'withKnobsOptions',
            children: [
              {
                name: 'displays HTML code',
                id: 'displaysHtmlCode',
              },
            ],
          },
        ],
      },
      {
        name: 'Links',
        id: 'links',
        children: [
          {
            name: 'Link',
            id: 'link',
            children: [
              {
                name: 'First',
                id: 'first',
              },
              {
                name: 'Second',
                id: 'second',
              },
            ],
          },
          {
            name: 'Button',
            id: 'button',
            children: [
              {
                name: 'First',
                id: 'first',
              },
              {
                name: 'Second',
                id: 'second',
              },
            ],
          },
          {
            name: 'Select',
            id: 'select',
            children: [
              {
                name: 'Index',
                id: 'index',
              },
              {
                name: 'First',
                id: 'first',
              },
              {
                name: 'Second',
                id: 'second',
              },
              {
                name: 'Third',
                id: 'third',
              },
            ],
          },
          {
            name: 'Href',
            id: 'href',
            children: [
              {
                name: 'log',
                id: 'log',
              },
            ],
          },
          {
            name: 'Scroll position',
            id: 'scrollPosition',
            children: [
              {
                name: 'First',
                id: 'first',
              },
              {
                name: 'Second',
                id: 'second',
              },
            ],
          },
        ],
      },
      {
        name: 'Notes',
        id: 'notes',
        children: [
          {
            name: 'withNotes',
            id: 'withNotes',
          },
          {
            name: 'withNotes rendering imported markdown',
            id: 'withnotesRenderingImportedMarkdown',
          },
          {
            name: 'withNotes rendering inline, github-flavored markdown',
            id: 'withnotesRenderingInlineGithubFlavoredMarkdown',
          },
          {
            name: 'with a markdown table',
            id: 'withAMarkdownTable',
          },
          {
            name: 'deprecated',
            id: 'deprecated',
            children: [
              {
                name: 'using decorator arguments, withNotes',
                id: 'usingDecoratorArgumentsWithnotes',
              },
              {
                name: 'using decorator arguments, withMarkdownNotes',
                id: 'usingDecoratorArgumentsWithmarkdownnotes',
              },
            ],
          },
        ],
      },
      {
        name: 'Storyshots',
        id: 'storyshots',
        children: [
          {
            name: 'text',
            id: 'text',
          },
          {
            name: 'table',
            id: 'table',
          },
        ],
      },
      {
        name: 'Viewport',
        id: 'viewport',
        children: [
          {
            name: 'default',
            id: 'default',
          },
          {
            name: 'Custom Default (Kindle Fire 2)',
            id: 'customDefaultKindleFire2',
            children: [
              {
                name: 'Inherited',
                id: 'inherited',
              },
              {
                name: 'Overridden via "withViewport" parameterized decorator',
                id: 'overriddenViaWithviewportParameterizedDecorator',
              },
            ],
          },
          {
            name: 'withViewport',
            id: 'withViewport',
            children: [
              {
                name: 'onViewportChange',
                id: 'onViewportChange',
              },
            ],
          },
          {
            name: 'deprecated',
            id: 'deprecated',
            children: [
              {
                name: 'Overridden via "withViewport" decorator',
                id: 'overriddenViaWithviewportDecorator',
              },
              {
                name: 'Overridden via "Viewport" component',
                id: 'overriddenViaViewportComponent',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'App',
    id: 'app',
    children: [
      {
        name: 'acceptance',
        id: 'acceptance',
        children: [
          {
            name: 'cra-kitchen-sink',
            id: 'craKitchenSink',
          },
          {
            name: 'vue-kitchen-sink',
            id: 'vueKitchenSink',
          },
          {
            name: 'svelte-kitchen-sink',
            id: 'svelteKitchenSink',
          },
          {
            name: 'angular-cli',
            id: 'angularCli',
          },
          {
            name: 'polymer-cli',
            id: 'polymerCli',
          },
          {
            name: 'mithril-kitchen-sink',
            id: 'mithrilKitchenSink',
          },
          {
            name: 'html-kitchen-sink',
            id: 'htmlKitchenSink',
          },
        ],
      },
    ],
  },
  {
    name: 'Core',
    id: 'core',
    children: [
      {
        name: 'Parameters',
        id: 'parameters',
        children: [
          {
            name: 'passed to story',
            id: 'passedToStory',
          },
        ],
      },
      {
        name: 'Events',
        id: 'events',
        children: [
          {
            name: 'Force re-render',
            id: 'forceReRender',
          },
        ],
      },
    ],
  },
  {
    name: 'Other',
    id: 'other',
    children: [
      {
        name: 'stories',
        id: 'stories',
        children: [
          {
            name: 'Dirname Example',
            id: 'dirnameExample',
            children: [
              {
                name: 'story 1',
                id: 'story1',
              },
              {
                name: 'story 2',
                id: 'story2',
              },
            ],
          },
        ],
      },
    ],
  },
];
