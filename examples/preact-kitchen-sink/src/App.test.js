import { h, render } from 'react';
import { document } from 'global';

import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');

  render(<App />, div);
});
