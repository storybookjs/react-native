import React from 'react';
import { shallow } from 'enzyme';
import { RotateViewport } from '../RotateViewport';

const setup = addition => {
  const props = {
    onClick: jest.fn(),
    disabled: false,
    ...addition,
  };

  const result = shallow(<RotateViewport {...props} />);

  return { result, props };
};

describe('Viewport/RotateViewport', () => {
  it('renders correctly', () => {
    const { result } = setup();
    expect(result).toMatchSnapshot();
  });

  it('has a click handler set via props', () => {
    const { result, props } = setup();
    const button = result.find('Styled(button)');
    expect(button).toHaveProp('onClick');

    button.simulate('click');
    expect(props.onClick).toHaveBeenCalled();
  });

  it('renders the correctly if not-disabled', () => {
    const { result } = setup({ disabled: false });
    expect(result.find('Styled(button)')).toHaveProp('disabled', false);
  });

  it('renders the correctly if disabled', () => {
    const { result } = setup({ disabled: true });
    expect(result.find('Styled(button)')).toHaveProp('disabled', true);
  });

  it('renders the correctly if not-active', () => {
    const { result } = setup({ active: false });
    expect(result.html()).toContain('Landscape');
  });

  it('renders the correctly if active', () => {
    const { result } = setup({ active: true });
    expect(result.html()).toContain('Vertical');
  });
});
