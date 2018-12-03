import React from 'react';
import { shallow, mount } from 'enzyme';
import EventEmitter from 'eventemitter3';

// eslint-disable-next-line import/no-unresolved
import Panel from '../Panel';
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
    const BackgroundPanel = shallow(<Panel channel={channel} api={mockedApi} active />);

    expect(BackgroundPanel).toBeDefined();
  });

  it('should have a default background value of transparent', () => {
    const BackgroundPanel = shallow(<Panel channel={channel} api={mockedApi} active />);

    expect(BackgroundPanel.state().backgrounds).toHaveLength(0);
  });

  it('should show setup instructions if no colors provided', () => {
    const BackgroundPanel = shallow(<Panel channel={channel} api={mockedApi} active />);

    expect(BackgroundPanel.html().match(/Setup Instructions/gim).length).toBeGreaterThan(0);
  });

  it('should set the query string', () => {
    const SpiedChannel = new EventEmitter();
    mount(<Panel channel={SpiedChannel} api={mockedApi} active />);
    SpiedChannel.emit(Events.SET, backgrounds);

    expect(mockedApi.getQueryParam).toBeCalledWith('background');
  });

  it('should not unset the query string', () => {
    const SpiedChannel = new EventEmitter();
    mount(<Panel channel={SpiedChannel} api={mockedApi} active />);
    SpiedChannel.emit(Events.UNSET, []);

    expect(mockedApi.setQueryParams).not.toHaveBeenCalled();
  });

  it('should accept colors through channel and render the correct swatches with a default swatch', () => {
    const SpiedChannel = new EventEmitter();
    const BackgroundPanel = mount(<Panel channel={SpiedChannel} api={mockedApi} active />);
    SpiedChannel.emit(Events.SET, backgrounds);

    expect(BackgroundPanel.state('backgrounds')).toEqual(backgrounds);
  });

  it('should allow setting a default swatch', () => {
    const SpiedChannel = new EventEmitter();
    const BackgroundPanel = mount(<Panel channel={SpiedChannel} api={mockedApi} active />);
    const [head, ...tail] = backgrounds;
    const localBgs = [{ ...head, default: true }, ...tail];
    SpiedChannel.emit(Events.SET, localBgs);

    expect(BackgroundPanel.state('backgrounds')).toEqual(localBgs);
    BackgroundPanel.setState({ backgrounds: localBgs }); // force re-render

    // check to make sure the default bg was added
    const headings = BackgroundPanel.find('h4');
    expect(headings).toHaveLength(8);
  });

  it('should allow the default swatch become the background color', () => {
    const SpiedChannel = new EventEmitter();
    const BackgroundPanel = mount(<Panel channel={SpiedChannel} api={mockedApi} active />);
    const [head, second, ...tail] = backgrounds;
    const localBgs = [head, { ...second, default: true }, ...tail];
    SpiedChannel.on('background', bg => {
      expect(bg).toBe(second.value);
    });
    SpiedChannel.emit(Events.SET, localBgs);

    expect(BackgroundPanel.state('backgrounds')).toEqual(localBgs);
    BackgroundPanel.setState({ backgrounds: localBgs }); // force re-render

    // check to make sure the default bg was added
    const headings = BackgroundPanel.find('h4');
    expect(headings).toHaveLength(8);
  });

  it('should unset all swatches on receiving the background-unset message', () => {
    const SpiedChannel = new EventEmitter();
    const BackgroundPanel = mount(<Panel channel={SpiedChannel} api={mockedApi} active />);
    SpiedChannel.emit(Events.SET, backgrounds);

    expect(BackgroundPanel.state('backgrounds')).toEqual(backgrounds);
    BackgroundPanel.setState({ backgrounds }); // force re-render

    SpiedChannel.emit(Events.UNSET);
    expect(BackgroundPanel.state('backgrounds')).toHaveLength(0);
  });

  it('should set iframe background', () => {
    const SpiedChannel = new EventEmitter();
    const BackgroundPanel = mount(<Panel channel={SpiedChannel} api={mockedApi} active />);
    BackgroundPanel.setState({ backgrounds }); // force re-render

    BackgroundPanel.find('h4')
      .first()
      .simulate('click');

    expect(BackgroundPanel.instance().iframe.style).toMatchObject({
      background: backgrounds[0].value,
    });
  });
});
