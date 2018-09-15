import * as utils from './nav';

const sample = [
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
];

const rootSeparator = '\\|';
const groupSeperator = '\\/|\\.';

describe('toNested', () => {
  test('transforms input correctly', () => {
    const result = utils.toNested(sample, { rootSeparator, groupSeperator });

    expect(result).toMatchInlineSnapshot(`
Array [
  Object {
    "children": Array [
      Object {
        "children": Array [
          Object {
            "id": "default",
            "name": "default",
          },
          Object {
            "id": "withStories",
            "name": "with stories",
          },
        ],
        "id": "searchBox",
        "name": "SearchBox",
      },
      Object {
        "children": Array [
          Object {
            "children": Array [
              Object {
                "id": "withoutFiltertext",
                "name": "without filterText",
              },
              Object {
                "id": "withFiltertext",
                "name": "with filterText",
              },
            ],
            "id": "textFilter",
            "name": "TextFilter",
          },
        ],
        "id": "stories",
        "name": "stories",
      },
    ],
    "id": "ui",
    "name": "UI",
  },
  Object {
    "children": Array [
      Object {
        "children": Array [
          Object {
            "children": Array [
              Object {
                "id": "sizes",
                "name": "sizes",
              },
              Object {
                "id": "validations",
                "name": "validations",
              },
            ],
            "id": "select",
            "name": "Select",
          },
          Object {
            "children": Array [
              Object {
                "id": "withKnobs",
                "name": "with knobs",
              },
              Object {
                "id": "sizes",
                "name": "sizes",
              },
              Object {
                "id": "validations",
                "name": "validations",
              },
              Object {
                "id": "alignment",
                "name": "alignment",
              },
            ],
            "id": "button",
            "name": "Button",
          },
          Object {
            "children": Array [
              Object {
                "id": "withKnobsControlled",
                "name": "with knobs (controlled)",
              },
              Object {
                "id": "sizes",
                "name": "sizes",
              },
              Object {
                "id": "validations",
                "name": "validations",
              },
              Object {
                "id": "alignment",
                "name": "alignment",
              },
            ],
            "id": "textarea",
            "name": "Textarea",
          },
        ],
        "id": "form",
        "name": "Form",
      },
    ],
    "id": "components",
    "name": "Components",
  },
]
`);
  });
});
