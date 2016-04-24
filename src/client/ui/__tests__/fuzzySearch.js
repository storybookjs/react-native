const { describe, it } = global;
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import FuzzySearch from '../fuzzySearch';

function noop() {
}

const list = [{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
}, {
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown',
}, {
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown',
}];

const options = {
  keys: ['author', 'title'],   // keys to search in
};

describe('<FuzzySearch/>', () => {
  it('should not render when show props is set to false', () => {
    const wrapper = mount(
      <FuzzySearch
        placeholder="testing"
        onSelect={noop}
        list={list}
        options={options}
      />);
    const div = wrapper.find('.react-fuzzy-search');
    expect(div.length).to.equal(0);
  });

  it('should set correct placeholder text', () => {
    const wrapper = mount(
      <FuzzySearch
        placeholder="testing"
        onSelect={noop}
        list={list}
        options={options}
        show
      />);
    const placeholder = wrapper.ref('searchBox').prop('placeholder');
    expect(placeholder).to.equal('testing');
  });

  it('should show results on typing', () => {
    const wrapper = mount(
      <FuzzySearch
        list={list}
        onSelect={noop}
        options={options}
        show
      />
    );
    const input = wrapper.ref('searchBox');
    expect(wrapper.state('results').length).to.equal(0);

    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.state('results').length).to.not.equal(0);
  });

  it('should set results as ids if passed in options', () => {
    options.id = 'id';
    const wrapper = mount(
      <FuzzySearch
        list={list}
        onSelect={noop}
        options={options}
        show
      />
    );

    const input = wrapper.ref('searchBox');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.state('results')).to.eql([2, 1]);
  });
});
