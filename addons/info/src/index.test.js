import React from 'react';
import { mount } from 'enzyme';

import { withInfo, setDefaults } from '.';
import externalMdDocs from '../README.md';

/* eslint-disable */
const TestComponent = ({ func, obj, array, number, string, bool, empty }) => (
  <div>
    <h1>{String(func)}</h1>
    <h2>{String(obj)}</h2>
    <h3>{String(array)}</h3>
    <h4>{String(number)}</h4>
    <h5>{String(string)}</h5>
    <h6>{String(bool)}</h6>
    <p>{String(empty)}</p>
    <a href="#">test</a>
    <code>storiesOf</code>
    <ul>
      <li>1</li>
      <li>2</li>
    </ul>
  </div>
);
/* eslint-enable */

const reactClassPath = 'some/path/TestComponent.jsx';
const storybookReactClassMock = {
  name: 'TestComponent',
  path: reactClassPath,
  docgenInfo: {
    description: `
# Awesome test component description
## with markdown support
**bold** *cursive*
    `,
    name: 'TestComponent',
  },
};

const testOptions = { propTables: false };

const testMarkdown = `# Test story
## with markdown info
containing **bold**, *cursive* text, \`code\` and [a link](https://github.com)`;

describe('addon Info', () => {
  // eslint-disable-next-line react/prop-types
  const storyFn = ({ name }) => (
    <div>
      It's a {name} story:
      <TestComponent
        func={x => x + 1}
        obj={{ a: 'a', b: 'b' }}
        array={[1, 2, 3]}
        number={7}
        string="seven"
        bool
      />
    </div>
  );
  it('should render <Info /> and markdown', () => {
    const Info = withInfo(testMarkdown)(storyFn);

    expect(mount(<Info />)).toMatchSnapshot();
  });
  it('should render <Info /> and external markdown', () => {
    const Info = withInfo(externalMdDocs)(storyFn);

    expect(mount(<Info />)).toMatchSnapshot();
  });
  it('should render with text options', () => {
    const Info = withInfo({ text: 'some text here' })(storyFn);
    mount(<Info />);
  });
  it('should render with missed info', () => {
    setDefaults(testOptions);
    const Info = withInfo()(storyFn);
    mount(<Info />);
  });

  it('should render component description if story kind matches component', () => {
    const previousReactClassesValue = global.STORYBOOK_REACT_CLASSES[reactClassPath];
    Object.assign(global.STORYBOOK_REACT_CLASSES, { [reactClassPath]: storybookReactClassMock });

    const Info = () =>
      withInfo({ inline: true, propTables: false })(storyFn, {
        kind: 'TestComponent',
        name: 'Basic test',
      });

    expect(mount(<Info />)).toMatchSnapshot();

    Object.assign(global.STORYBOOK_REACT_CLASSES, { [reactClassPath]: previousReactClassesValue });
  });

  it('should render component description if story name matches component', () => {
    const previousReactClassesValue = global.STORYBOOK_REACT_CLASSES[reactClassPath];
    Object.assign(global.STORYBOOK_REACT_CLASSES, { [reactClassPath]: storybookReactClassMock });

    const Info = () =>
      withInfo({ inline: true, propTables: false })(storyFn, {
        kind: 'Test Components',
        name: 'TestComponent',
      });

    expect(mount(<Info />)).toMatchSnapshot();

    Object.assign(global.STORYBOOK_REACT_CLASSES, { [reactClassPath]: previousReactClassesValue });
  });
});
