import { types } from '../../actions';

export function ensureKind(storyKinds, selectedKind) {
  if (!storyKinds) return selectedKind;

  const found = storyKinds.find(item => item.kind === selectedKind);
  if (found) return found.kind;
  // if the selected kind is non-existant, select the first kind
  const kinds = storyKinds.map(item => item.kind);
  return kinds[0];
}

export function ensureStory(storyKinds, selectedKind, selectedStory) {
  if (!storyKinds) return selectedStory;

  const kindInfo = storyKinds.find(item => item.kind === selectedKind);
  if (!kindInfo) return null;

  const found = kindInfo.stories.find(item => item === selectedStory);
  if (found) return found;

  return kindInfo.stories[0];
}

export function jumpToStory(storyKinds, selectedKind, selectedStory, direction) {
  const flatteredStories = [];
  let currentIndex = -1;

  storyKinds.forEach(({ kind, stories }) => {
    stories.forEach((story) => {
      flatteredStories.push({ kind, story });
      if (kind === selectedKind && story === selectedStory) {
        currentIndex = flatteredStories.length - 1;
      }
    });
  });

  const jumpedStory = flatteredStories[currentIndex + direction];
  if (!jumpedStory) {
    return { selectedKind, selectedStory };
  }

  return {
    selectedKind: jumpedStory.kind,
    selectedStory: jumpedStory.story,
  };
}

const defaultState = {
  actions: [],
  options: {
    name: 'REACT STORYBOOK',
    url: 'https://github.com/kadirahq/react-storybook',
  },
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case types.SELECT_STORY: {
      const selectedKind = ensureKind(state.stories, action.kind);
      const selectedStory = ensureStory(state.stories, selectedKind, action.story);
      return {
        ...state,
        selectedKind,
        selectedStory,
      };
    }

    case types.JUMP_TO_STORY: {
      const { selectedKind, selectedStory } =
        jumpToStory(state.stories, state.selectedKind, state.selectedStory, action.direction);
      return {
        ...state,
        selectedKind,
        selectedStory,
      };
    }

    case types.SET_STORIES: {
      const newState = {
        ...state,
        stories: action.stories,
      };

      newState.selectedKind = ensureKind(newState.stories, state.selectedKind);
      newState.selectedStory = ensureStory(
        newState.stories, newState.selectedKind, state.selectedStory
      );

      return newState;
    }

    case types.SET_OPTIONS: {
      const newOptions = {
        ...state.options,
        ...action.options,
      };

      return {
        ...state,
        options: newOptions,
      };
    }

    case types.SET_QUERY_PARAMS: {
      const newQueryParams = {
        ...state.customQueryParams,
        ...action.customQueryParams,
      };

      Object.keys(action.customQueryParams).forEach(key => {
        if (newQueryParams[key] === null) {
          delete newQueryParams[key];
        }
      });

      return {
        ...state,
        customQueryParams: newQueryParams,
      };
    }

    default:
      return state;
  }
}
