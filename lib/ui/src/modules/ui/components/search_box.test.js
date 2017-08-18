import { shallow } from 'enzyme';
import React from 'react';
import ReactModal from 'react-modal';
import FuzzySearch from '@storybook/react-fuzzy';

import SearchBox from './search_box';

describe('manager.ui.components.search_box', () => {
  describe('render', () => {
    test('should render FuzzySearch inside ReactModal', () => {
      const wrap = shallow(<SearchBox showSearchBox />);

      const modal = wrap.find(ReactModal);
      expect(modal).toBePresent();
      expect(modal).toHaveProp('isOpen', true);
      expect(modal).toHaveProp('contentLabel', 'Search');

      const search = modal.find(FuzzySearch);
      expect(search).toBePresent();
      expect(search).toHaveProp('keys', ['value', 'type']);
      expect(search).toHaveProp('autoFocus', true);
    });

    test('should format stories', () => {
      const stories = [
        {
          kind: 'a',
          stories: ['b', 'c'],
        },
      ];
      const wrap = shallow(<SearchBox stories={stories} />);
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
      const wrap = shallow(<SearchBox onClose={onClose} />);

      const modal = wrap.find(ReactModal);
      modal.simulate('requestClose');

      expect(onClose).toHaveBeenCalled();
    });

    test('should handle selecting a kind', () => {
      const onSelectStory = jest.fn();
      const onClose = jest.fn();
      const wrap = shallow(<SearchBox onSelectStory={onSelectStory} onClose={onClose} />);

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
      const wrap = shallow(<SearchBox onSelectStory={onSelectStory} onClose={onClose} />);

      const modal = wrap.find(FuzzySearch);
      modal.simulate('select', {
        type: 'story',
        value: 'a',
        kind: 'b',
      });

      expect(onSelectStory).toHaveBeenCalledWith('b', 'a');
      expect(onClose).toHaveBeenCalled();
    });
  });
});
