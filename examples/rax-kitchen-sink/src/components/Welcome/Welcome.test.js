import { createElement } from 'rax';
import renderer from 'rax-test-renderer';
import Welcome from './index';

test('Welcome render correctly', () => {
  const tree = renderer.create(<Welcome />).toJSON();

  expect(tree).toMatchSnapshot();
});
