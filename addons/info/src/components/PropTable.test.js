import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import PropTable, { multiLineText } from './PropTable';

describe('PropTable', () => {
  describe('multiLineText', () => {
    const singleLine = 'Foo bar baz';
    const unixMultiLineText = 'foo \n bar \n baz';
    const windowsMultiLineText = 'foo \r bar \r baz';
    const duplicatedMultiLine = 'foo\nfoo\nfoo';
    const propDefinitions = [
      {
        defaultValue: undefined,
        description: '',
        propType: { name: 'string' },
        property: 'foo',
        required: false,
      },
    ];
    const FooComponent = () => <div />;
    const propTableProps = {
      type: FooComponent,
      maxPropArrayLength: 5,
      maxPropObjectKeys: 5,
      maxPropStringLength: 5,
      propDefinitions,
    };

    it('should include all propTypes by default', () => {
      const wrapper = shallow(<PropTable {...propTableProps} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should exclude excluded propTypes', () => {
      const props = { ...propTableProps, excludedPropTypes: ['foo'] };
      const wrapper = shallow(<PropTable {...props} />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should return a blank string for a null input', () => {
      expect(multiLineText(null)).toBe(null);
    });
    it('should return a blank string for an undefined input', () => {
      expect(multiLineText(undefined)).toBe(undefined);
    });
    it('should cast a number to a string', () => {
      expect(multiLineText(1)).toBe('1');
    });
    it('should return its input for a single line of text', () => {
      expect(multiLineText(singleLine)).toBe(singleLine);
    });
    it('should return an array for unix multiline text', () => {
      expect(multiLineText(unixMultiLineText)).toHaveLength(3);
    });
    it('should return an array for windows multiline text', () => {
      expect(multiLineText(windowsMultiLineText)).toHaveLength(3);
    });
    it('should return an array with unique keys for duplicated multiline text', () => {
      const wrappers = multiLineText(duplicatedMultiLine).map(tag => shallow(tag));
      const keys = wrappers.map(wrapper => wrapper.key());
      const deDup = new Set(keys);
      expect(keys).toHaveLength(deDup.size);
    });
    it('should have 2 br tags for 3 lines of text', () => {
      const tree = renderer.create(multiLineText(unixMultiLineText)).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
