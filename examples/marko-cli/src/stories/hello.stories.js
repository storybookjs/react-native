import Hello from '../components/hello/index.marko';

export default {
  title: 'Main/Hello',
  parameters: {
    component: Hello,
  },
};

export const Simple = () => ({ input: { name: 'abc', age: 20 } });
export const Story2 = () => 'NOT A MARKO RENDER_RESULT';
Story2.story = { name: 'with ERROR!' };
