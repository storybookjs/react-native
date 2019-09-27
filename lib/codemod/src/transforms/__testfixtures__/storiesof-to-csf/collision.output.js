export const foo = 1;
const bar = 1;
const barStory = 1;
const baz = 1;
const bazStory1 = 1;

export default {
  title: 'foo',
  excludeStories: ['foo'],
};

export const fooStory = () => <button />;

fooStory.story = {
  name: 'foo',
};

export const barStory1 = () => <button />;

barStory1.story = {
  name: 'bar',
};

export const bazStory = () => <button />;

bazStory.story = {
  name: 'bazStory',
};

export const bazStory2 = () => <button />;

bazStory2.story = {
  name: 'baz',
};
