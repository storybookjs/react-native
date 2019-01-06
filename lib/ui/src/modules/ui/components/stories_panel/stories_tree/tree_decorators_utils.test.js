import { shallow } from 'enzyme';
import { highlightNode } from './tree_decorators_utils';

describe('manager.ui.components.stories_panel.tree_decorators_utils.test', () => {
  describe('highlightNode', () => {
    test('should return name when there no highlighting matches', () => {
      const node = {
        name: 'some name',
        highlight: null,
      };

      const result = highlightNode(node);

      expect(result).toEqual('some name');
    });

    test('should return highlighted name when there matches', () => {
      const node = {
        name: 'some name',
        highlight: [[1, 3], [5, 7]],
      };

      const result = highlightNode(
        node,
        { highLightText: { textDecoration: 'underline' } },
        'red',
        'white'
      );

      expect(shallow(result[0]).html()).toEqual('<span>s</span>');
      expect(shallow(result[1]).html()).toEqual(
        '<strong style="text-decoration:underline;background:red;color:white">ome</strong>'
      );
      expect(shallow(result[2]).html()).toEqual('<span> </span>');
      expect(shallow(result[3]).html()).toEqual(
        '<strong style="text-decoration:underline;background:red;color:white">nam</strong>'
      );
      expect(shallow(result[4]).html()).toEqual('<span>e</span>');
    });
  });
});
