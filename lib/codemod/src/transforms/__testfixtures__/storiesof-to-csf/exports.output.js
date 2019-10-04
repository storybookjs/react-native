export const foo = 1;

export default {
  title: 'bar',
  excludeStories: ['foo'],
};

export const baz = () => <button />;

baz.story = {
  name: 'baz',
};
