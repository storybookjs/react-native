import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

describe('<App />', () => {
  it('has 1 child', () => {
    const tree = renderer.create(<App />).toJSON();
    if (!Array.isArray(tree) && tree.children) {
      expect(tree.children.length).toBe(1);
    } else {
      throw new Error('App has no children');
    }
  });
});
