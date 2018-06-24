import { document } from 'global';
import Button from './Button.svelte';

let target;
let component;

describe('Button Component', () => {
  beforeEach(() => {
    target = document.createElement('div');

    component = new Button({ target });
  });

  it('should render `text` property', () => {
    const text = 'Hello world';

    component.set({ text });

    const componentText = target.firstChild.textContent.trim();

    expect(componentText).toEqual(text);
  });
});
