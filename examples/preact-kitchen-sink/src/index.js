import { h, render } from 'preact';
import { document } from 'global';

import App from './App';
import './index.css';

render(<App />, document.body);
