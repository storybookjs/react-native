import { document } from 'global';
import App from './App.svelte';

const target = document.getElementById('app');
const data = { heading: 'Svelte Kitchen Sink example' };

// eslint-disable-next-line no-new
new App({ target, data });
