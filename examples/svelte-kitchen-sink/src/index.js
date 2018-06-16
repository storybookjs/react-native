import App from './App.svelte';

const target = document.getElementById('app'); // eslint-disable-line
const data = { msg: 'hello world' };

// eslint-disable-next-line
new App({target, data});
