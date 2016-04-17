const { describe, it } = global;
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Foldable from '../foldable';

describe('<Foldable />', function () {
  describe('render', function () {
    it('should render action compact by default', function () {
      const data = {
        name: 'test action',
        args: 'things',
      };

      const compactString = '{"name":"test action","args":"things"}';

      const wrap = shallow(<Foldable action={data} />);
      const content = wrap.find('.foldable-content').first();

      expect(content.text()).to.equal(compactString);
    });

    it('should render action in full when unfolded', function () {
      const data = {
        name: 'test action',
        args: 'things',
      };

      const fullString = '{ "name": "test action",\n  "args": "things"\n}';

      const wrap = shallow(<Foldable action={data} />);
      const toggle = wrap.find('.foldable-toggle').first();

      toggle.simulate('click');

      expect(wrap.state()).to.deep.equal({ collapsed: false });

      const content = wrap.find('.foldable-content').first();

      expect(content.text()).to.equal(fullString);
    });
  });
});
