import React from 'react';
import { shallow } from 'enzyme'; // eslint-disable-line import/no-extraneous-dependencies
import { RotateViewport } from '../RotateViewport';
import * as styles from '../styles';

describe('Viewport/RotateViewport', () => {
  let subject;
  let props;

  beforeEach(() => {
    props = {
      onClick: jest.fn(),
    };

    subject = shallow(<RotateViewport {...props} />);
  });

  it('has a label', () => {
    expect(subject.find('label').text()).toEqual('Rotate');
  });

  describe('button', () => {
    let btn;

    beforeEach(() => {
      btn = subject.find('button');
    });

    it('has a click handler set via props', () => {
      // note, this shouldn't trigger if disabled, but enzyme doesn't care
      btn.simulate('click');
      expect(props.onClick).toHaveBeenCalled();
    });

    it('renders the the action styles on the button', () => {
      expect(btn.props().style).toEqual(expect.objectContaining(styles.action));
    });

    describe('is active', () => {
      beforeEach(() => {
        subject.setProps({ active: true });
        btn = subject.find('button');
      });

      it('renders the correct text', () => {
        expect(btn.text()).toEqual('Vertical');
      });
    });

    describe('is inactive', () => {
      beforeEach(() => {
        subject.setProps({ active: false });
        btn = subject.find('button');
      });

      it('renders the correct text', () => {
        expect(btn.text()).toEqual('Landscape');
      });
    });

    describe('is disabled', () => {
      beforeEach(() => {
        subject.setProps({ disabled: true });
        btn = subject.find('button');
      });

      it('renders the disabled styles', () => {
        expect(btn.props().style).toEqual(expect.objectContaining(styles.disabled));
      });

      it('sets the disabled property on the button', () => {
        expect(btn.props().disabled).toEqual(true);
      });
    });

    describe('is enabled', () => {
      beforeEach(() => {
        subject.setProps({ disabled: false });
        btn = subject.find('button');
      });

      it('renders the disabled styles', () => {
        expect(btn.props().style).not.toEqual(expect.objectContaining(styles.disabled));
      });

      it('does not set the disabled property on the button', () => {
        expect(btn.props().disabled).toEqual(false);
      });
    });
  });
});
