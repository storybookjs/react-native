import ReactDOM from 'react-dom';
import { document } from 'global';

import decorator from '../src';

const content = decorator(() => 'Hello World!');
const wrapper = document.querySelector('#content');
ReactDOM.render(content, wrapper);
