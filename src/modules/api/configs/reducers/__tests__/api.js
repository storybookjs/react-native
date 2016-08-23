import reducer from '../api';
import { expect } from 'chai';
import { types } from '../../../actions';
const { describe, it } = global;

describe('manager.preview.config.reducers.preview', () => {
  describe('SELECT_STORY', () => {
    it('should set kind and story', () => {
      const stories = [
        {
          kind: 'kk',
          stories: ['ss'],
        },
      ];
      const action = {
        type: types.SELECT_STORY,
        kind: 'kk',
        story: 'ss',
      };

      const newState = reducer({ stories }, action);
      expect(newState.selectedKind).to.be.equal(action.kind);
      expect(newState.selectedStory).to.be.equal(action.story);
    });

    it('should set the first kind, if the kind is non-exisitance', () => {
      const stories = [
        {
          kind: 'bb',
          stories: ['ss'],
        },
      ];
      const action = {
        type: types.SELECT_STORY,
        kind: 'kk',
        story: 'ss',
      };

      const newState = reducer({ stories }, action);
      expect(newState.selectedKind).to.be.equal(stories[0].kind);
      expect(newState.selectedStory).to.be.equal(action.story);
    });

    it('should set the first story, if the story is non-exisitance', () => {
      const stories = [
        {
          kind: 'kk',
          stories: ['ss', 'll'],
        },
      ];
      const action = {
        type: types.SELECT_STORY,
        kind: 'kk',
        story: 'dd',
      };

      const newState = reducer({ stories }, action);
      expect(newState.selectedKind).to.be.equal(action.kind);
      expect(newState.selectedStory).to.be.equal('ss');
    });

    it('should keep selectedKind and selectedStory as is when there are no stories', () => {
      const action = {
        type: types.SELECT_STORY,
        kind: 'kk',
        story: 'ss',
      };

      const newState = reducer({}, action);
      expect(newState.selectedKind).to.be.equal(action.kind);
      expect(newState.selectedStory).to.be.equal(action.story);
    });
  });

  describe('SET_STORIES', () => {
    it('should replace stories', () => {
      const stories = { aa: 10 };
      const selectedKind = 'kk';
      const selectedStory = 'ss';
      const newStories = [
        {
          kind: 'kk',
          stories: ['ss'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ stories, selectedKind, selectedStory }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal(selectedKind);
      expect(newState.selectedStory).to.be.equal(selectedStory);
    });

    it('should set selectedKind again if not exists', () => {
      const stories = { aa: 10 };
      const selectedKind = 'kk';
      const selectedStory = 'ss';
      const newStories = [
        {
          kind: 'dd',
          stories: ['ss'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ stories, selectedKind, selectedStory }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal('dd');
      expect(newState.selectedStory).to.be.equal(selectedStory);
    });

    it('should set selectedStory again if not exists', () => {
      const stories = { aa: 10 };
      const selectedKind = 'kk';
      const selectedStory = 'ss';
      const newStories = [
        {
          kind: 'kk',
          stories: ['pk'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ stories, selectedKind, selectedStory }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal(selectedKind);
      expect(newState.selectedStory).to.be.equal('pk');
    });

    it('should set default selectedKind and selectedStory', () => {
      const stories = { aa: 10 };
      const newStories = [
        {
          kind: 'kk',
          stories: ['pk'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ stories }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal('kk');
      expect(newState.selectedStory).to.be.equal('pk');
    });

    it('should respect existing selectedKind and selectStory', () => {
      const selectedKind = 'bb';
      const selectedStory = 'dd';

      const newStories = [
        {
          kind: 'kk',
          stories: ['pk'],
        },
        {
          kind: 'bb',
          stories: ['pk', 'dd'],
        },
      ];

      const action = {
        type: types.SET_STORIES,
        stories: newStories,
      };

      const newState = reducer({ selectedKind, selectedStory }, action);
      expect(newState.stories).to.deep.equal(newStories);
      expect(newState.selectedKind).to.be.equal(selectedKind);
      expect(newState.selectedStory).to.be.equal(selectedStory);
    });
  });

  describe('JUMP_TO_STORY', () => {
    it('should jump to the next story', () => {
      const selectedKind = 'kk';
      const selectedStory = 'ss';
      const stories = [
        { kind: 'kk', stories: ['ss'] },
        { kind: 'bb', stories: ['aa', 'cc'] },
      ];

      const action = {
        type: types.JUMP_TO_STORY,
        direction: 1,
      };

      const newState = reducer({
        stories, selectedKind, selectedStory,
      }, action);

      expect(newState.selectedKind).to.be.equal('bb');
      expect(newState.selectedStory).to.be.equal('aa');
    });

    it('should jump to the prev story', () => {
      const selectedKind = 'bb';
      const selectedStory = 'cc';
      const stories = [
        { kind: 'kk', stories: ['ss'] },
        { kind: 'bb', stories: ['aa', 'cc'] },
      ];

      const action = {
        type: types.JUMP_TO_STORY,
        direction: -1,
      };

      const newState = reducer({
        stories, selectedKind, selectedStory,
      }, action);

      expect(newState.selectedKind).to.be.equal('bb');
      expect(newState.selectedStory).to.be.equal('aa');
    });

    it('should jump nowhere it there is no story', () => {
      const selectedKind = 'kk';
      const selectedStory = 'ss';
      const stories = [
        { kind: 'kk', stories: ['ss'] },
        { kind: 'bb', stories: ['aa', 'cc'] },
      ];

      const action = {
        type: types.JUMP_TO_STORY,
        direction: -10,
      };

      const newState = reducer({
        stories, selectedKind, selectedStory,
      }, action);

      expect(newState.selectedKind).to.be.equal('kk');
      expect(newState.selectedStory).to.be.equal('ss');
    });
  });
});

describe('SET OPTIONS', () => {
  it('should set options merging with the default ones', () => {
    const options = {
      name: 'foo',
      url: 'bar',
    };

    const action = {
      type: types.SET_OPTIONS,
      options: {
        name: 'hello world',
      },
    };

    const expected = {
      name: 'hello world',
      url: 'bar',
    };

    const newState = reducer({ options }, action);
    expect(newState.options).to.eql(expected);
  });
});

describe('SET_QUERY_PARAMS', () => {
  it('should set custom query params merging with the existing ones', () => {
    const customQueryParams = {
      fooParams: 'foo',
      barParams: 'bar',
    };

    const action = {
      type: types.SET_QUERY_PARAMS,
      customQueryParams: {
        fooParams: 'baz',
      },
    };

    const expected = {
      fooParams: 'baz',
      barParams: 'bar',
    };

    const newState = reducer({ customQueryParams }, action);
    expect(newState.customQueryParams).to.eql(expected);
  });

  it('should unset custom query params when the value is null', () => {
    const customQueryParams = {
      fooParams: 'foo',
      barParams: 'bar',
    };

    const action = {
      type: types.SET_QUERY_PARAMS,
      customQueryParams: {
        fooParams: null,
      },
    };

    const expected = {
      barParams: 'bar',
    };

    const newState = reducer({ customQueryParams }, action);
    expect(newState.customQueryParams).to.eql(expected);
  });
});
