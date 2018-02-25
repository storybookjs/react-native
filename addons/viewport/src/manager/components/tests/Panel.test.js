import React from 'react';
import { shallow } from 'enzyme';
import { document } from 'global';

import { Panel } from '../Panel';
import { resetViewport, viewportsTransformer, configuredStyles } from '../viewportInfo';
import * as styles from '../styles';
import { DEFAULT_VIEWPORT, INITIAL_VIEWPORTS } from '../../../shared';

describe('Viewport/Panel', () => {
  const props = {
    channel: {
      on: jest.fn(),
      removeListener: jest.fn(),
    },
    api: {
      onStory: jest.fn()
    }
  };

  let subject;

  beforeEach(() => {
    subject = shallow(<Panel {...props} />);
  });

  describe('construct', () => {
    it('creates the initial state', () => {
      expect(subject.instance().state).toEqual({
        viewport: DEFAULT_VIEWPORT,
        defaultViewport: DEFAULT_VIEWPORT,
        viewports: viewportsTransformer(INITIAL_VIEWPORTS),
        isLandscape: false,
      });
    });

    it('listens on `update` channel', () => {
      expect(props.channel.on).toHaveBeenCalledWith(
        'addon:viewport:update',
        subject.instance().changeViewport
      );
    });
  });

  describe('componentDidMount', () => {
    let previousGet;

    beforeEach(() => {
      subject.instance().iframe = undefined;
      previousGet = document.getElementById;
      document.getElementById = jest.fn(() => 'iframe');
      subject.instance().componentDidMount();
    });

    afterEach(() => {
      document.getElementById = previousGet;
    });

    it('gets the iframe', () => {
      expect(subject.instance().iframe).toEqual('iframe');
    });

    it('listens on the `configure` topic', () => {
      expect(props.channel.on).toHaveBeenCalledWith(
        'addon:viewport:configure',
        subject.instance().configure
      );
    });
  });

  describe('componentWillUnmount', () => {
    beforeEach(() => {
      subject.instance().componentWillUnmount();
    });

    it('removes `update` channel listener', () => {
      expect(props.channel.removeListener).toHaveBeenCalledWith(
        'addon:viewport:update',
        subject.instance().changeViewport
      );
    });

    it('removes `configure` channel listener', () => {
      expect(props.channel.removeListener).toHaveBeenCalledWith(
        'addon:viewport:configure',
        subject.instance().configure
      );
    });
  });

  describe('configure', () => {
    beforeEach(() => {
      subject.instance().setState = jest.fn();
      subject.instance().updateIframe = jest.fn();
      subject.instance().configure({
        defaultViewport: 'iphone6',
        viewports: {
          foo: {
            styles: {
              width: '50px'
            }
          },
          bar: {
            styles: {
              width: '100px'
            }
          }
        }
      });
    });

    it('sets the state with the new information', () => {
      expect(subject.instance().setState).toHaveBeenCalledWith(
        {
          defaultViewport: 'iphone6',
          viewport: 'iphone6',
          viewports: {
            foo: {
              styles: {
                width: '50px',
                ...configuredStyles
              }
            },
            bar: {
              styles: {
                width: '100px',
                ...configuredStyles
              }
            }
          }
        },
        subject.instance().updateIframe
      );
    });
  });

  describe('changeViewport', () => {
    beforeEach(() => {
      subject.instance().setState = jest.fn();
      subject.instance().updateIframe = jest.fn();
    });

    describe('new viewport', () => {
      beforeEach(() => {
        subject.instance().changeViewport(INITIAL_VIEWPORTS[0]);
      });

      it('sets the state with the new information', () => {
        expect(subject.instance().setState).toHaveBeenCalledWith(
          {
            viewport: INITIAL_VIEWPORTS[0],
            isLandscape: false,
          },
          subject.instance().updateIframe
        );
      });
    });

    describe('same as previous viewport', () => {
      beforeEach(() => {
        subject.instance().changeViewport(DEFAULT_VIEWPORT);
      });

      it('doesnt update the state', () => {
        expect(subject.instance().setState).not.toHaveBeenCalled();
      });
    });
  });

  describe('toggleLandscape', () => {
    beforeEach(() => {
      subject.setState({ isLandscape: false });
      subject.instance().setState = jest.fn();
      subject.instance().toggleLandscape();
    });

    it('updates the landscape to be the opposite', () => {
      expect(subject.instance().setState).toHaveBeenCalledWith(
        { isLandscape: true },
        subject.instance().updateIframe
      );
    });
  });

  describe('updateIframe', () => {
    let iframe;

    describe('no iframe found', () => {
      beforeEach(() => {
        subject.instance().iframe = null;
      });

      it('throws a TypeError', () => {
        expect(() => {
          subject.instance().updateIframe();
        }).toThrow('Cannot find Storybook iframe');
      });
    });

    describe('iframe found', () => {
      beforeEach(() => {
        iframe = { style: {} };
        subject.instance().iframe = iframe;
      });

      it('sets the viewport information on the iframe', () => {
        subject.instance().updateIframe();
        expect(subject.instance().iframe.style).toEqual(resetViewport.styles);
      });

      it('swaps the height/width when in landscape', () => {
        subject.instance().state.isLandscape = true;
        subject.instance().updateIframe();

        expect(subject.instance().iframe.style).toEqual(
          expect.objectContaining({
            height: resetViewport.styles.width,
            width: resetViewport.styles.height,
          })
        );
      });
    });
  });

  describe('render', () => {
    describe('reset button', () => {
      let resetBtn;

      beforeEach(() => {
        subject.instance().changeViewport = jest.fn();
        resetBtn = subject.find('button');
      });

      it('styles the reset button as disabled if viewport is default', () => {
        expect(resetBtn.props().style).toEqual(expect.objectContaining(styles.disabled));
      });

      it('enabels the reset button if not default', () => {
        subject.setState({ viewport: 'iphone6' });

        // Find updated button
        resetBtn = subject.find('button');

        expect(resetBtn.props().style).toEqual({
          ...styles.button,
          marginTop: 30,
          padding: 20,
        });
      });

      it('toggles the landscape on click', () => {
        resetBtn.simulate('click');
        expect(subject.instance().changeViewport).toHaveBeenCalledWith(DEFAULT_VIEWPORT);
      });
    });

    describe('SelectViewport', () => {
      let select;

      beforeEach(() => {
        select = subject.find('SelectViewport');
        subject.instance().changeViewport = jest.fn();
      });

      it('passes the activeViewport', () => {
        expect(select.props()).toEqual(
          expect.objectContaining({
            activeViewport: DEFAULT_VIEWPORT,
          })
        );
      });

      it('passes the defaultViewport', () => {
        expect(select.props()).toEqual(
          expect.objectContaining({
            defaultViewport: DEFAULT_VIEWPORT,
          })
        );
      });

      it('passes the INITIAL_VIEWPORTS', () => {
        expect(select.props()).toEqual(
          expect.objectContaining({
            viewports: viewportsTransformer(INITIAL_VIEWPORTS),
          })
        );
      });

      it('onChange it updates the viewport', () => {
        const e = { target: { value: 'iphone6' } };
        select.simulate('change', e);
        expect(subject.instance().changeViewport).toHaveBeenCalledWith(e.target.value);
      });
    });

    describe('RotateView', () => {
      let toggle;

      beforeEach(() => {
        toggle = subject.find('RotateViewport');
        jest.spyOn(subject.instance(), 'toggleLandscape');
        subject.instance().forceUpdate();
      });

      it('passes the active prop based on the state of the panel', () => {
        expect(toggle.props().active).toEqual(subject.state('isLandscape'));
      });

      describe('is on the default viewport', () => {
        beforeEach(() => {
          subject.setState({ viewport: DEFAULT_VIEWPORT });
        });

        it('sets the disabled property', () => {
          expect(toggle.props().disabled).toEqual(true);
        });
      });

      describe('is on a non-default viewport', () => {
        beforeEach(() => {
          subject.setState({ viewport: 'iphone6' });
          toggle = subject.find('RotateViewport');
        });

        it('the disabled property is false', () => {
          expect(toggle.props().disabled).toEqual(false);
        });
      });
    });
  });
});
