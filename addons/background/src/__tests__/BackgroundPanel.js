import React from 'react';
import { shallow, mount } from 'enzyme';
import EventEmitter from 'events';

import BackgroundPanel from '../BackgroundPanel';

const backgrounds = [
  { name: 'black', value: '#000000' },
  { name: 'secondary', value: 'rgb(123,123,123)' },
  { name: 'tertiary', value: 'rgba(123,123,123,.5)' },
  { name: 'An image', value: 'url(http://placehold.it/350x150)' },
];

const mockedApi = {
  getQueryParam: jest.fn(),
  setQueryParams: jest.fn(),
};
const channel = new EventEmitter();

describe('Background Panel', () => {
  it('should exist', () => {
    const backgroundPanel = shallow(<BackgroundPanel channel={channel} api={mockedApi} />);

    expect(backgroundPanel).toBeDefined();
  });

  it('should have a default background value of transparent', () => {
    const backgroundPanel = shallow(<BackgroundPanel channel={channel} api={mockedApi} />);

    expect(backgroundPanel.state().backgrounds).toHaveLength(0);
  });

  it('should show setup instructions if no colors provided', () => {
    const backgroundPanel = shallow(<BackgroundPanel channel={channel} api={mockedApi} />);

    expect(backgroundPanel.html().match(/Setup Instructions/gim).length).toBeGreaterThan(0);
  });

  it('should set the query string', () => {
    const SpiedChannel = new EventEmitter();
    mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit('background-set', backgrounds);

    expect(mockedApi.getQueryParam).toBeCalledWith('background');
  });

  it('should unset the query string', () => {
    const SpiedChannel = new EventEmitter();
    mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit('background-unset', []);

    expect(mockedApi.setQueryParams).toBeCalledWith({ background: null });
  });

  it('should accept colors through channel and render the correct swatches with a default swatch', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit('background-set', backgrounds);

    expect(backgroundPanel.state('backgrounds')).toEqual(backgrounds);
  });

  it('should allow setting a default swatch', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    const [head, ...tail] = backgrounds;
    const localBgs = [{ ...head, default: true }, ...tail];
    SpiedChannel.emit('background-set', localBgs);

    expect(backgroundPanel.state('backgrounds')).toEqual(localBgs);
    backgroundPanel.setState({ backgrounds: localBgs }); // force re-render

    // check to make sure the default bg was added
    const headings = backgroundPanel.find('h4');
    expect(headings).toHaveLength(8);
  });

  it('should allow the default swatch become the background color', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    const [head, second, ...tail] = backgrounds;
    const localBgs = [head, { ...second, default: true }, ...tail];
    SpiedChannel.on('background', bg => {
      expect(bg).toBe(second.value);
    });
    SpiedChannel.emit('background-set', localBgs);

    expect(backgroundPanel.state('backgrounds')).toEqual(localBgs);
    backgroundPanel.setState({ backgrounds: localBgs }); // force re-render

    // check to make sure the default bg was added
    const headings = backgroundPanel.find('h4');
    expect(headings).toHaveLength(8);
  });

  it('should unset all swatches on receiving the background-unset message', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit('background-set', backgrounds);

    expect(backgroundPanel.state('backgrounds')).toEqual(backgrounds);
    backgroundPanel.setState({ backgrounds }); // force re-render

    SpiedChannel.emit('background-unset');
    expect(backgroundPanel.state('backgrounds')).toHaveLength(0);
  });

  it('should pass the event from swatch clicks through the provided channel', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = mount(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    backgroundPanel.setState({ backgrounds }); // force re-render

    const spy = jest.fn();
    SpiedChannel.on('background', spy);

    backgroundPanel
      .find('h4')
      .first()
      .simulate('click');

    expect(spy).toBeCalledWith(backgrounds[0].value);
  });
});
