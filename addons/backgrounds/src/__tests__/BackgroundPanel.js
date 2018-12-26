import React from 'react';
import { shallow, mount } from 'enzyme';
import EventEmitter from 'eventemitter3';

import BackgroundPanel from '../BackgroundPanel';
import Events from '../constants';

const backgrounds = [
  { name: 'black', value: '#000000', default: true },
  { name: 'secondary', value: 'rgb(123,123,123)' },
  { name: 'tertiary', value: 'rgba(123,123,123,.5)' },
  { name: 'An image', value: 'url(http://placehold.it/350x150)' },
];

const mockedApi = {
  getQueryParam: jest.fn(),
  setQueryParams: jest.fn(),
};
const channel = new EventEmitter();

jest.mock('global', () => ({
  document: {
    getElementById() {
      return {
        style: {},
      };
    },
  },
}));

describe('Background Panel', () => {
  it('should exist', () => {
    const backgroundPanel = shallow(<BackgroundPanel channel={channel} api={mockedApi} active />);

    expect(backgroundPanel).toBeDefined();
  });

  it('should have a default background value of transparent', () => {
    const backgroundPanel = shallow(<BackgroundPanel channel={channel} api={mockedApi} active />);

    expect(backgroundPanel.state().backgrounds).toHaveLength(0);
  });

  it('should show setup instructions if no colors provided', () => {
    const backgroundPanel = shallow(<BackgroundPanel channel={channel} api={mockedApi} active />);

    expect(backgroundPanel.html().match(/Setup Instructions/gim).length).toBeGreaterThan(0);
  });

  it('should set the query string', () => {
    const SpiedChannel = new EventEmitter();
    mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} active />);
    SpiedChannel.emit(Events.SET, backgrounds);

    expect(mockedApi.getQueryParam).toHaveBeenCalledWith('background');
  });

  it('should not unset the query string', () => {
    const SpiedChannel = new EventEmitter();
    mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} active />);
    SpiedChannel.emit(Events.UNSET, []);

    expect(mockedApi.setQueryParams).not.toHaveBeenCalled();
  });

  it('should accept colors through channel and render the correct swatches with a default swatch', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(
      <BackgroundPanel channel={SpiedChannel} api={mockedApi} active />
    );
    SpiedChannel.emit(Events.SET, backgrounds);

    expect(backgroundPanel.state('backgrounds')).toEqual(backgrounds);
  });

  it('should allow setting a default swatch', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(
      <BackgroundPanel channel={SpiedChannel} api={mockedApi} active />
    );
    const [head, ...tail] = backgrounds;
    const localBgs = [{ ...head, default: true }, ...tail];
    SpiedChannel.emit(Events.SET, localBgs);

    expect(backgroundPanel.state('backgrounds')).toEqual(localBgs);
    backgroundPanel.setState({ backgrounds: localBgs }); // force re-render

    // check to make sure the default bg was added
    const headings = backgroundPanel.find('h4');
    expect(headings).toHaveLength(8);
  });

  it('should allow the default swatch become the background color', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(
      <BackgroundPanel channel={SpiedChannel} api={mockedApi} active />
    );
    const [head, second, ...tail] = backgrounds;
    const localBgs = [head, { ...second, default: true }, ...tail];
    SpiedChannel.on('background', bg => {
      expect(bg).toBe(second.value);
    });
    SpiedChannel.emit(Events.SET, localBgs);

    expect(backgroundPanel.state('backgrounds')).toEqual(localBgs);
    backgroundPanel.setState({ backgrounds: localBgs }); // force re-render

    // check to make sure the default bg was added
    const headings = backgroundPanel.find('h4');
    expect(headings).toHaveLength(8);
  });

  it('should unset all swatches on receiving the background-unset message', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(
      <BackgroundPanel channel={SpiedChannel} api={mockedApi} active />
    );
    SpiedChannel.emit(Events.SET, backgrounds);

    expect(backgroundPanel.state('backgrounds')).toEqual(backgrounds);
    backgroundPanel.setState({ backgrounds }); // force re-render

    SpiedChannel.emit(Events.UNSET);
    expect(backgroundPanel.state('backgrounds')).toHaveLength(0);
  });

  it('should set iframe background', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(
      <BackgroundPanel channel={SpiedChannel} api={mockedApi} active />
    );
    backgroundPanel.setState({ backgrounds }); // force re-render

    backgroundPanel
      .find('h4')
      .first()
      .simulate('click');

    expect(backgroundPanel.instance().iframe.style).toMatchObject({
      background: backgrounds[0].value,
    });
  });
});
