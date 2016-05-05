import React from 'react';
import Preview from '../preview';
import { shallow } from 'enzyme';
import { expect } from 'chai';
const { describe, it } = global;

describe('manager.preview.components.preview', () => {
  it('should load the correct iframe with the URL', () => {
    const url = 'http://the-url';
    const ref = shallow(<Preview url={url} />);
    const iframe = ref.find('iframe').get(0);

    expect(iframe.props.src).to.be.equal(url);
  });
});
