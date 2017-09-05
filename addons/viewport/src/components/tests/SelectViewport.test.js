import React from 'react';
import { shallow } from 'enzyme'; // eslint-disable-line import/no-extraneous-dependencies
import { SelectViewport } from '../SelectViewport';
import { viewports, defaultViewport } from '../viewportInfo';
import * as styles from '../styles';

describe('Viewport/SelectViewport', () => {
  let subject;
  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      activeViewport: defaultViewport,
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
      expect(firstOption.props().value).toEqual(defaultViewport);
    });

    describe('dynamic options', () => {
      const viewportKeys = Object.keys(viewports);
      it('has at least 1 option', () => {
        expect(!!viewportKeys.length).toEqual(true);
      });

      viewportKeys.forEach(key => {
        let option;

        beforeEach(() => {
          option = subject.find(`[value="${key}"]`);
        });

        it(`renders an option with key ${key}`, () => {
          expect(option.node).toBeDefined();
        });

        it(`renders an option for ${viewports[key].name}`, () => {
          expect(option.text()).toEqual(viewports[key].name);
        });
      });
    });
  });
});
