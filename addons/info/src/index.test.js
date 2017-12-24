import React from 'react';
import { mount } from 'enzyme';

import AddonInfo, { withInfo, setDefaults } from './';

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
  </div>);
/* eslint-enable */

const testContext = { kind: 'addon_info', story: 'jest_test' };
const testOptions = { propTables: false };

const testMarkdown = `# Test story
## with markdown info
containing **bold**, *cursive* text, \`code\` and [a link](https://github.com)`;

describe('addon Info', () => {
  const story = context => (
    <div>
      It's a {context.story} story:
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
  const api = {
    add: (name, fn) => fn(testContext),
  };

  it('should render <Info /> and markdown', () => {
    const Info = withInfo(testMarkdown)(story);

    expect(mount(<Info />)).toMatchSnapshot();
  });
  it('should render with text options', () => {
    const Info = withInfo({ text: 'some text here' })(story);
    mount(<Info />);
  });
  it('should render with missed info', () => {
    setDefaults(testOptions);
    const Info = withInfo()(story);
    mount(<Info />);
  });
  it('should show deprecation warning', () => {
    const addWithInfo = AddonInfo.addWithInfo.bind(api);
    addWithInfo('jest', story);
  });
});
