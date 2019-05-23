import { document } from 'global';
import Button from './Button.svelte';

let target;
let component;

describe('Button Component', () => {
  beforeEach(() => {
    target = document.createElement('div');

    component = new Button.default({ target }); // eslint-disable-line new-cap
  });

  it('should render `text` property', done => {
    const text = 'Hello world';
    const expected = `Round corners ${text}`;

    component.$on('afterUpdate', () => {
      const componentText = target.firstChild.textContent.trim();

      expect(componentText).toEqual(expected);

      done();
    });

    component.$set({ text });
  });
});
