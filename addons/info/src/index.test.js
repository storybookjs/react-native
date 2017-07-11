/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import AddonInfo, { withInfo } from './';

describe('addon Info', () => {
  const story = context =>
    <div>
      It's a {context.story} story
    </div>;
  const api = {
    add: (name, fn) => fn({ kind: 'addon_info', story: 'jest_test' }),
  };
  it('should render <Info />', () => {
    const Info = withInfo('Test Info')(story);
    ReactDOM.render(<Info />, document.createElement('div'));
  });
  it('should show deprecation warning', () => {
    const addWithInfo = AddonInfo.addWithInfo.bind(api);
    addWithInfo('jest', 'test info', story);
  });
});
