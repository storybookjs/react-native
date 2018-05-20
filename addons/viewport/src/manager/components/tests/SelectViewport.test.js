import React from 'react';
import { shallow } from 'enzyme';
import { SelectViewport } from '../SelectViewport';
import { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from '../../../shared';

const setup = () => {
  const props = {
    onChange: jest.fn(),
    activeViewport: DEFAULT_VIEWPORT,
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: DEFAULT_VIEWPORT,
  };

  return { props, result: shallow(<SelectViewport {...props} />) };
};

describe('Viewport/SelectViewport', () => {
  it('is correctly rendered', () => {
    const { result } = setup();
    expect(result).toMatchSnapshot();
  });

  it('has a default option first', () => {
    const { result } = setup();
    expect(result.find('Styled(select)').props().value).toEqual(DEFAULT_VIEWPORT);
  });

  it('has at least 1 option', () => {
    const viewportKeys = Object.keys(INITIAL_VIEWPORTS);
    expect(viewportKeys.length).toBeGreaterThan(0);
  });

  const viewportKeys = Object.keys(INITIAL_VIEWPORTS);
  const { result } = setup();
  viewportKeys.forEach(key => {
    const { name } = INITIAL_VIEWPORTS[key];
    const expectedText = key === DEFAULT_VIEWPORT ? `(Default) ${name}` : name;

    it(`renders an option for ${name}`, () => {
      const option = result.find(`option[value="${key}"]`);
      expect(option.text()).toEqual(expectedText);
    });
  });
});
