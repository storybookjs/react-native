import Hello from '../components/hello/index.marko';

export default {
  title: 'Main|Hello',
};

export const Simple = () => ({ template: Hello, input: { name: 'abc', age: 20 } });
export const story2 = () => 'NOT A MARKO RENDER_RESULT';
story2.story = { name: 'with ERROR!' };
