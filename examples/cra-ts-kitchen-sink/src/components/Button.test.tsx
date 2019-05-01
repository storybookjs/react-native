import * as React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

describe('Button', () => {
  it('renders', () => {
    const wrapper = shallow(<Button>OK</Button>);
    expect(wrapper).toMatchInlineSnapshot(`
<button
  type="button"
>
  OK
</button>
`);
  });

  it('calls onClick on button click', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<Button onClick={handleClick}>OK</Button>);
    wrapper.find('button').simulate('click');
    expect(handleClick).toHaveBeenCalled();
  });
});
