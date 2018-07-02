import { shallow } from 'enzyme';
import React from 'react';
import ReactModal from 'react-modal';
import FuzzySearch from 'react-fuzzy';

import { SearchBox } from './search_box';

const setup = (props = {}) => {
  const defaultProps = {
    showSearchBox: false,
    onSelectStory: () => undefined,
    onClose: () => undefined,
  };
  return {
    wrap: shallow(<SearchBox {...defaultProps} {...props} theme={{}} />),
  };
};

describe('manager.ui.components.search_box', () => {
  describe('render', () => {
    test('should render FuzzySearch inside ReactModal', () => {
      const { wrap } = setup({ showSearchBox: true });

      const modal = wrap.find(ReactModal);
      expect(modal).toExist();
      expect(modal).toHaveProp('isOpen', true);
      expect(modal).toHaveProp('contentLabel', 'Search');

      const search = modal.find(FuzzySearch);
      expect(search).toExist();
      expect(search).toHaveProp('keys', ['value', 'type']);
    });

    test('should format stories', () => {
      const stories = [
        {
          kind: 'a',
          stories: ['b', 'c'],
        },
      ];
      const { wrap } = setup({ stories });

      const search = wrap.find(FuzzySearch);

      const expectedList = [
        {
          type: 'kind',
          value: 'a',
          id: 1,
        },
        {
          type: 'story',
          value: 'b',
          id: 2,
          kind: 'a',
        },
        {
          type: 'story',
          value: 'c',
          id: 3,
          kind: 'a',
        },
      ];
      expect(search).toHaveProp('list', expectedList);
    });
  });

  describe('events', () => {
    test('should call the onClose prop when modal requests it', () => {
      const onClose = jest.fn();
      const { wrap } = setup({ onClose });

      const modal = wrap.find(ReactModal);
      modal.simulate('requestClose');

      expect(onClose).toHaveBeenCalled();
    });

    test('should handle selecting a kind', () => {
      const onSelectStory = jest.fn();
      const onClose = jest.fn();
      const { wrap } = setup({ onSelectStory, onClose });

      const modal = wrap.find(FuzzySearch);
      modal.simulate('select', {
        type: 'kind',
        value: 'a',
      });

      expect(onSelectStory).toHaveBeenCalledWith('a', null);
      expect(onClose).toHaveBeenCalledWith();
    });

    test('should handle selecting a story', () => {
      const onSelectStory = jest.fn();
      const onClose = jest.fn();
      const { wrap } = setup({ onSelectStory, onClose });

      const modal = wrap.find(FuzzySearch);
      modal.simulate('select', {
        type: 'story',
        value: 'a',
        kind: 'b',
      });

      expect(onSelectStory).toHaveBeenCalledWith('b', 'a');
      expect(onClose).toHaveBeenCalled();
    });

    test('should handle selecting a story with click', () => {
      const stories = [
        {
          kind: 'a',
          stories: ['b', 'c'],
        },
      ];
      const onSelectStory = jest.fn();
      const onClose = jest.fn();
      const { wrap } = setup({ onSelectStory, onClose, stories, showSearchBox: true });

      const modal = wrap.find(FuzzySearch).dive();
      modal.find('input').simulate('change', {
        target: { value: 'b' },
      });

      const option = modal.findWhere(el => el.key() && el.key().startsWith('b_'));
      option.simulate('click');

      expect(onSelectStory).toHaveBeenCalledWith('a', 'b');
      expect(onClose).toHaveBeenCalled();
    });
  });
});
