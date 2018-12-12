import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import DocgenButton from '../components/DocgenButton';
import FlowTypeButton from '../components/FlowTypeButton';
import BaseButton from '../components/BaseButton';
import ForwardedRefButton from '../components/ForwardedRefButton';
import { NamedExportButton } from '../components/NamedExportButton';
import TableComponent from '../components/TableComponent';
import externalMdDocs from './addon-info-resources/EXAMPLE.md';

storiesOf('Addons|Info.React Docgen', module)
  .addDecorator(withInfo)
  .add(
    'Comments from PropType declarations',
    () => (
      <DocgenButton
        onClick={action('clicked')}
        label="Docgen Button"
        disabled={false}
        one={{ key: 1 }}
        shape={{
          id: 3,
          arr: [],
          shape: {
            shape: {
              foo: 'bar',
            },
          },
          func: () => {},
        }}
        arrayOf={[1, 2, 3]}
      />
    ),
    {
      info:
        'Comments above the PropType declarations should be extracted from the React component file itself and rendered in the Info Addon prop table',
    }
  )
  .add(
    'Comments from Flow declarations',
    () => <FlowTypeButton onClick={action('clicked')} label="Flow Typed Button" />,
    {
      info:
        'Comments above the Flow declarations should be extracted from the React component file itself and rendered in the Info Addon prop table',
    }
  )
  .add(
    'Comments from component declaration',
    () => <BaseButton onClick={action('clicked')} label="Button" />,
    {
      info:
        'Comments above the component declaration should be extracted from the React component file itself and rendered below the Info Addon heading',
    }
  )
  .add(
    'Comments from named export component declaration',
    () => <NamedExportButton onClick={action('clicked')} label="Button" />,
    {
      info:
        'Comments above the component declaration should be extracted from the React component file itself and rendered below the Info Addon heading',
    }
  );

const markdownDescription = `
#### You can use markdown in your withInfo description.

Sometimes you might want to manually include some code examples:
~~~js
const Button = () => <button />;
~~~

Maybe include a [link](http://storybook.js.org) to your project as well.
`;

storiesOf('Addons|Info.Markdown', module)
  .addDecorator(withInfo)
  .add(
    'Displays Markdown in description',
    () => <BaseButton onClick={action('clicked')} label="Button" />,
    { info: markdownDescription }
  )
  .add(
    'From internal Markdown file',
    () => <BaseButton onClick={action('clicked')} label="Button" />,
    {
      info: `
      # internal
      ## markdown
      file
    `,
    }
  )
  .add(
    'From external Markdown file',
    () => <BaseButton onClick={action('clicked')} label="Button" />,
    { info: externalMdDocs }
  );

const JSXDescription = (
  <div>
    <h2>This is a JSX info section</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare massa rutrum metus
      commodo, a mattis velit dignissim. Fusce vestibulum turpis sed massa egestas pharetra. Sed at
      libero nulla.
    </p>
    <p>
      <a href="https://github.com/storybooks/react-storybook-addon-info">This is a link</a>
    </p>
    <p>
      <img alt="350x150" src="http://placehold.it/350x150" />
    </p>
  </div>
);

storiesOf('Addons|Info.JSX', module)
  .addDecorator(withInfo)
  .add(
    'Displays JSX in description',
    () => <BaseButton onClick={action('clicked')} label="Button" />,
    {
      info: { text: JSXDescription },
    }
  );

storiesOf('Addons|Info.Options.inline', module)
  .addDecorator(withInfo)
  .add('Inlines component inside story', () => <BaseButton label="Button" />, {
    info: {
      text: 'Component should be inlined between description and PropType table',
      inline: true, // Displays info inline vs click button to view
    },
  });

storiesOf('Addons|Info.Options.excludedPropTypes', module)
  .addDecorator(withInfo)
  .add(
    'Excludes propTypes that are in the excludedPropTypes array',
    () => <BaseButton label="Button" />,
    {
      info: {
        text: 'Label propType should be excluded',
        excludedPropTypes: ['label'],
      },
    }
  );

storiesOf('Addons|Info.Options.header', module)
  .addDecorator(withInfo)
  .add('Shows or hides Info Addon header', () => <BaseButton label="Button" />, {
    info: {
      text: 'The Info Addon header should be hidden',
      header: false, // Toggles display of header with component name and description
    },
  });

storiesOf('Addons|Info.Options.source', module)
  .addDecorator(withInfo)
  .add('Shows or hides Info Addon source', () => <BaseButton label="Button" />, {
    info: {
      text: 'The Info Addon source section should be hidden',
      source: false, // Displays the source of story Component
    },
  });

storiesOf('Addons|Info.Options.propTables', module)
  .addDecorator(withInfo)
  .add('Shows additional component prop tables', () => <BaseButton label="Button" />, {
    info: {
      text: 'There should be a prop table added for a component not included in the story',
      propTables: [FlowTypeButton],
    },
  });

storiesOf('Addons|Info.Options.propTablesExclude', module)
  .addDecorator(withInfo)
  .add(
    'Exclude component from prop tables',
    () => (
      <div>
        <BaseButton label="Button" />
        <FlowTypeButton label="Flow Typed Button" />
      </div>
    ),
    {
      info: {
        text: 'This can exclude extraneous components from being displayed in prop tables.',
        propTablesExclude: [FlowTypeButton],
      },
    }
  );

storiesOf('Addons|Info.Options.styles', module)
  .addDecorator(withInfo)
  .add('Extend info styles with an object', () => <BaseButton label="Button" />, {
    info: {
      styles: {
        button: {
          base: {
            background: 'purple',
          },
        },
        header: {
          h1: {
            color: 'green',
          },
        },
      },
    },
  })
  .add('Full control over styles using a function', () => <BaseButton label="Button" />, {
    info: {
      styles: stylesheet => ({
        ...stylesheet,
        header: {
          ...stylesheet.header,
          h1: {
            ...stylesheet.header.h1,
            color: 'red',
          },
        },
      }),
    },
  });

storiesOf('Addons|Info.Options.TableComponent', module)
  .addDecorator(withInfo)
  .add('Use a custom component for the table', () => <BaseButton label="Button" />, {
    info: {
      TableComponent,
    },
  });

storiesOf('Addons|Info.Decorator', module)
  .addDecorator(withInfo('Info can take options via the global or local decorator as well.'))
  .add('Use Info as story decorator', () => <BaseButton label="Button" />);

const hoc = WrapComponent => ({ ...props }) => <WrapComponent {...props} />;

const Input = hoc(() => <input type="text" />);

const TextArea = hoc(({ children }) => <textarea>{children}</textarea>);

storiesOf('Addons|Info.GitHub issues', module)
  .addDecorator(withInfo)
  .add(
    '#1814',
    () => (
      <div>
        <Input />
        <TextArea />
      </div>
    ),
    {
      info: 'Allow Duplicate DisplayNames for HOC #1814',
    }
  );

storiesOf('Addons|Info.Options.maxPropsIntoLine === 0', module)
  .addDecorator(withInfo)
  .add(
    'Object and array props are broken to lines',
    () => (
      <BaseButton
        label="Button"
        object={{
          one: 'Object and array properties',
          two: 'will be broken to different lines',
          three: 'if greater than `maxPropsIntoLine` option threshold.',
        }}
        array={['one', 'two', 'three', 'four']}
        arrayOfObjects={[
          {
            one: 'Object and array properties will be broken to different lines',
            two: 'if greater than `maxPropsIntoLine` option threshold.',
            object: {
              object1: {
                one: 'one',
                two: 'two',
                three: 'three',
              },
              array: ['one', 'two', 'three'],
              object2: {
                object: {
                  one: 'one',
                  two: 'two',
                  three: 'three',
                },
                array: [
                  'one',
                  'two',
                  {
                    object: {
                      object: {
                        one: 'one',
                        two: 'two',
                        three: 'three',
                      },
                      array: ['one', 'two', 'three'],
                    },
                  },
                ],
              },
            },
          },
        ]}
      />
    ),
    {
      info: {
        text: 'Component should be inlined between description and PropType table',
        inline: true,
        maxPropsIntoLine: 0,
      },
    }
  );

storiesOf('Addons|Info.Options.maxPropsIntoLine === 3', module)
  .addDecorator(withInfo)
  .add(
    'Object and array props are broken to lines',
    () => (
      <BaseButton
        label="Button"
        object={{
          one: 'Object and array properties',
          two: 'will be broken to different lines',
          three: 'if greater than `maxPropsIntoLine` option threshold.',
        }}
        array={['one', 'two', 'three', 'four']}
        arrayOfObjects={[
          {
            one: 'Object and array properties will be broken to different lines',
            two: 'if greater than `maxPropsIntoLine` option threshold.',
            object: {
              object1: {
                one: 'one',
                two: 'two',
                three: 'three',
              },
              array: ['one', 'two', 'three'],
              object2: {
                object: {
                  one: 'one',
                  two: 'two',
                  three: 'three',
                },
                array: [
                  'one',
                  'two',
                  {
                    object: {
                      object: {
                        one: 'one',
                        two: 'two',
                        three: 'three',
                      },
                      array: ['one', 'two', 'three'],
                    },
                  },
                ],
              },
            },
          },
        ]}
      />
    ),
    {
      info: {
        text: 'Component should be inlined between description and PropType table',
        inline: true,
        maxPropsIntoLine: 3,
      },
    }
  );

storiesOf('Addons|Info.Parameters', module)
  .addDecorator(
    withInfo({
      styles: {
        header: {
          h1: {
            color: 'green',
          },
        },
      },
    })
  )
  .addParameters({
    info: {
      text:
        'This text should be displayed on every story and the component should be inlined between description and PropType table',
      inline: true, // Displays info inline vs click button to view
    },
  })
  .add('Using paramaters across all stories', () => <BaseButton label="Button" />)
  .add(
    'Overwriting and extending the parameters and options set stories-wise',
    () => <BaseButton label="Button" />,
    {
      info: {
        text: 'Label propType should be excluded',
        excludedPropTypes: ['label'],
      },
    }
  )
  .add(
    'Overwrite the parameters with markdown variable',
    () => <BaseButton onClick={action('clicked')} label="Button" />,
    { info: markdownDescription }
  )
  .add(
    'Overwrite the text parameter with markdown inline',
    () => <BaseButton onClick={action('clicked')} label="Button" />,
    {
      info: {
        text: `
        description or documentation about my component, supports markdown

        ~~~js
        <Button>Click Here</Button>
        ~~~
      `,
      },
    }
  )
  .add(
    'Disable the addon entirely',
    () => <BaseButton onClick={action('clicked')} label="Button" />,
    { info: { disable: true } }
  );

storiesOf('Addons|Info.ForwardRef', module)
  .addDecorator(withInfo)
  .add('Displays forwarded ref components correctly', () => (
    <ForwardedRefButton label="Forwarded Ref Button" />
  ));

storiesOf('Addons|Info.deprecated', module).add(
  'Displays Markdown in description',
  withInfo(markdownDescription)(() => <BaseButton onClick={action('clicked')} label="Button" />)
);
