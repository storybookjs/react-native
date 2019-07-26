import { createElement } from 'rax';
import renderer from 'rax-test-renderer';
import App from './index';

test('App render correctly', () => {
  const tree = renderer.create(<App />).toJSON();

  expect(tree).toMatchSnapshot();
});
