export const foo = 1;

export default {
  title: 'bar',
  excludeStories: ['foo'],
};

export const story0 = () => <button />;

story0.story = {
  name: 'foo',
};
