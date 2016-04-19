const { describe, it } = global;
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import Foldable from '../foldable';

describe('<Foldable />', function () {
  describe('render', function () {
    it('should render action compact by default', function () {
      const data = {
        data: {
          name: 'test action',
          args: 'things',
        },
        count: 1,
      };

      const compactString = '{name:"test action",args:"things"}';

      const wrap = mount(<Foldable action={data} />);
      const content = wrap.ref('foldable-content');
      expect(content.text()).to.equal(compactString);
    });

    it('should render action in full when unfolded', function () {
      const data = {
        data: {
          name: 'test action',
          args: 'things',
        },
        count: 1,
      };

      const fullString = '{\n  name: "test action",\n  args: "things"\n}';

      const wrap = mount(<Foldable action={data} />);
      const toggle = wrap.ref('foldable-toggle');

      toggle.simulate('click');

      expect(wrap.state()).to.deep.equal({ collapsed: false });

      const content = wrap.ref('foldable-content');
      expect(content.text()).to.equal(fullString);
    });
  });
});
