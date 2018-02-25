import React from 'react';
import { shallow } from 'enzyme';
import { SelectViewport } from '../SelectViewport';
import { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from '../../../shared';
import * as styles from '../styles';

describe('Viewport/SelectViewport', () => {
  let subject;
  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      activeViewport: DEFAULT_VIEWPORT,
      viewports: INITIAL_VIEWPORTS,
      defaultViewport: DEFAULT_VIEWPORT,
    };

    subject = shallow(<SelectViewport {...props} />);
  });

  describe('label', () => {
    let label;
    beforeEach(() => {
      label = subject.find('label');
    });

    it('is correctly styled', () => {
      expect(label.props().style).toEqual(styles.label);
    });
  });

  describe('select', () => {
    it('has a default option first', () => {
      const firstOption = subject.find('option').first();
      expect(firstOption.props().value).toEqual(DEFAULT_VIEWPORT);
    });

    describe('dynamic options', () => {
      const viewportKeys = Object.keys(INITIAL_VIEWPORTS);
      it('has at least 1 option', () => {
        expect(viewportKeys.length).toBeGreaterThan(0);
      });

      viewportKeys.forEach(key => {
        let option;

        it(`renders an option for ${INITIAL_VIEWPORTS[key].name}`, () => {
          option = subject.find(`[value="${key}"]`);
          expect(option.text()).toEqual(INITIAL_VIEWPORTS[key].name);
        });
      });
    });
  });
});
