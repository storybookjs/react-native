import React from 'react';
import { shallow } from 'enzyme';
import { document } from 'global';

import { Panel } from '../Panel';
import { resetViewport, viewportsTransformer } from '../viewportInfo';
import { DEFAULT_VIEWPORT, INITIAL_VIEWPORTS } from '../../../shared';

const initialViewportAt = index => Object.keys(INITIAL_VIEWPORTS)[index];
const transformedInitialViewports = viewportsTransformer(INITIAL_VIEWPORTS);

jest.mock('lodash.debounce', () => jest.fn(fn => fn));

describe('Viewport/Panel', () => {
  const props = {
    channel: {
      on: jest.fn(),
      emit: jest.fn(),
      removeListener: jest.fn(),
    },
    api: {
      onStory: jest.fn(),
    },
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
        viewports: transformedInitialViewports,
        isLandscape: false,
      });
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

    it('listens on `configure` channel', () => {
      expect(props.channel.on).toHaveBeenCalledWith(
        'addon:viewport:configure',
        subject.instance().configure
      );
    });

    it('listens on `update` channel', () => {
      expect(props.channel.on).toHaveBeenCalledWith(
        'addon:viewport:update',
        subject.instance().changeViewport
      );
    });

    it('listens on `setStoryDefaultViewport` channel', () => {
      expect(props.channel.on).toHaveBeenCalledWith(
        'addon:viewport:setStoryDefaultViewport',
        subject.instance().setStoryDefaultViewport
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

    it('removes `setStoryDefaultViewport` channel listener', () => {
      expect(props.channel.removeListener).toHaveBeenCalledWith(
        'addon:viewport:setStoryDefaultViewport',
        subject.instance().setStoryDefaultViewport
      );
    });
  });

  describe('configure', () => {
    const initialConfigs = {
      defaultViewport: 'bar',
      viewports: {
        foo: {
          styles: {
            width: '0',
          },
        },
        bar: {
          styles: {
            width: '0',
          },
        },
      },
    };

    beforeEach(() => {
      subject.instance().setState = jest.fn();
      subject.instance().updateIframe = jest.fn();
      subject.instance().configure(initialConfigs);
    });

    it('sets the state with the new information', () => {
      expect(subject.instance().setState).toHaveBeenCalledWith(
        {
          ...initialConfigs,
          viewport: 'bar',
          viewports: viewportsTransformer(initialConfigs.viewports),
        },
        subject.instance().updateIframe
      );
    });

    it('makes first viewport default if default does not exist', () => {
      subject.instance().configure({
        ...initialConfigs,
        defaultViewport: 'iphone6',
      });
      expect(subject.instance().setState).toHaveBeenCalledWith(
        {
          defaultViewport: 'foo',
          viewport: 'foo',
          viewports: viewportsTransformer(initialConfigs.viewports),
        },
        subject.instance().updateIframe
      );
    });

    it('sets viewports to INITIAL_VIEWPORTS if viewports is empty', () => {
      subject.instance().configure({
        viewports: {},
      });
      expect(subject.instance().setState).toHaveBeenCalledWith(
        {
          defaultViewport: DEFAULT_VIEWPORT,
          viewport: DEFAULT_VIEWPORT,
          viewports: transformedInitialViewports,
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
        subject.instance().changeViewport(initialViewportAt(1));
      });

      it('sets the state with the new information', () => {
        expect(subject.instance().setState.mock.calls[0][0]).toEqual({
          viewport: initialViewportAt(1),
          isLandscape: false,
        });
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

  describe('setStoryDefaultViewport', () => {
    beforeEach(() => {
      subject.instance().setState = jest.fn();
      subject.instance().updateIframe = jest.fn();
      subject.instance().emitViewportChanged = jest.fn();
      subject.instance().setStoryDefaultViewport(initialViewportAt(1));
    });

    it('sets the state with the new information', () => {
      expect(subject.instance().setState.mock.calls).toHaveLength(2);
      expect(subject.instance().setState.mock.calls[0][0]).toEqual({
        storyDefaultViewport: 'iphone5',
      });

      expect(subject.instance().setState.mock.calls[1][0]).toEqual({
        viewport: initialViewportAt(1),
        isLandscape: false,
      });
      expect(typeof subject.instance().setState.mock.calls[1][1]).toEqual('function');

      const updaterFunction = subject.instance().setState.mock.calls[1][1];
      updaterFunction();

      expect(subject.instance().updateIframe).toHaveBeenCalled();
      expect(subject.instance().emitViewportChanged).toHaveBeenCalled();
    });
  });

  describe('emitViewportChanged', () => {
    beforeEach(() => {
      subject.instance().setState = jest.fn();
      subject.instance().updateIframe = jest.fn();
    });

    describe('new viewport', () => {
      beforeEach(() => {
        subject.instance().state = {
          ...subject.instance().state,
          viewport: initialViewportAt(1),
        };
        subject.instance().emitViewportChanged();
      });

      it('emits viewport changed event', () => {
        const viewport = transformedInitialViewports[initialViewportAt(1)];

        expect(props.channel.emit).toHaveBeenCalledWith('addon:viewport:viewportChanged', {
          viewport,
        });
      });
    });

    describe('same as previous viewport', () => {
      beforeEach(() => {
        subject.instance().emitViewportChanged();
      });

      it('does not emit viewport changed event', () => {
        expect(props.channel.emit).not.toHaveBeenCalled();
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

  describe('reset button', () => {
    let resetBtn;

    beforeEach(() => {
      subject.instance().changeViewport = jest.fn();
      resetBtn = subject.find('Styled(button)');
    });

    it('enables the reset button if not default', () => {
      subject.setState({ viewport: 'responsive' });
      resetBtn = subject.find('Styled(button)');
      expect(resetBtn).toHaveProp('disabled', true);

      subject.setState({ viewport: 'iphone6' });
      resetBtn = subject.find('Styled(button)');
      expect(resetBtn).toHaveProp('disabled', false);
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
          viewports: transformedInitialViewports,
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
