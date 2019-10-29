export const foo = 1;
const bar = 1;
const barStory = 1;
const baz = 1;
const bazStory1 = 1;

storiesOf('foo', module)
  .add('foo', () => <button />)
  .add('bar', () => <button />)
  .add('bazStory', () => <button />)
  .add('baz', () => <button />);
