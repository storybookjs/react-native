/* eslint no-underscore-dangle: 0 */
import EventEmitter from 'eventemitter3';
import memoize from 'memoizerific';
import debounce from 'lodash/debounce';
import { stripIndents } from 'common-tags';

import { Channel } from '@storybook/channels';
import Events from '@storybook/core-events';
import { logger } from '@storybook/client-logger';
import { StoryFn, Parameters } from '@storybook/addons';
import {
  DecoratorFunction,
  LegacyData,
  LegacyItem,
  StoreData,
  AddStoryArgs,
  StoreItem,
  ErrorLike,
} from './types';
import { HooksContext } from './hooks';

// TODO: these are copies from components/nav/lib
// refactor to DRY
const toKey = (input: string) =>
  input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

let count = 0;

const getId = (): number => {
  count += 1;
  return count;
};

const toExtracted = <T>(obj: T) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'function') {
      return acc;
    }
    if (Array.isArray(value)) {
      return Object.assign(acc, { [key]: value.slice().sort() });
    }
    return Object.assign(acc, { [key]: value });
  }, {});

interface Selection {
  storyId: string;
  viewMode: string;
}

interface StoryOptions {
  includeDocsOnly?: boolean;
}

const isStoryDocsOnly = (parameters?: Parameters) => {
  return parameters && parameters.docsOnly;
};

const includeStory = (story: StoreItem, options: StoryOptions = { includeDocsOnly: false }) => {
  if (options.includeDocsOnly) {
    return true;
  }
  return !isStoryDocsOnly(story.parameters);
};

export default class StoryStore extends EventEmitter {
  _error?: ErrorLike;

  _channel: Channel;

  _data: StoreData;

  _legacyData?: LegacyData;

  _legacydata: LegacyData;

  _revision: number;

  _selection: Selection;

  constructor(params: { channel: Channel }) {
    super();

    this._legacydata = {} as any;
    this._data = {} as any;
    this._revision = 0;
    this._selection = {} as any;
    this._channel = params.channel;
    this._error = undefined;
  }

  setChannel = (channel: Channel) => {
    this._channel = channel;
  };

  // NEW apis
  fromId = (id: string): StoreItem | null => {
    try {
      const data = this._data[id as string];

      if (!data || !data.getDecorated) {
        return null;
      }

      return data;
    } catch (e) {
      logger.warn('failed to get story:', this._data);
      logger.error(e);
      return null;
    }
  };

  raw(options?: StoryOptions) {
    return Object.values(this._data)
      .filter(i => !!i.getDecorated)
      .filter(i => includeStory(i, options))
      .map(({ id }) => this.fromId(id));
  }

  extract(options?: StoryOptions) {
    const stories = Object.entries(this._data);
    // determine if we should apply a sort to the stories or just use default import order
    if (Object.values(this._data).length > 0) {
      const index = Object.keys(this._data).find(
        key =>
          !!(this._data[key] && this._data[key].parameters && this._data[key].parameters.options)
      );
      if (index && this._data[index].parameters.options.storySort) {
        const sortFn = this._data[index].parameters.options.storySort;
        stories.sort(sortFn);
      }
    }
    // removes function values from all stories so they are safe to transport over the channel
    return stories.reduce(
      (a, [k, v]) => (includeStory(v, options) ? Object.assign(a, { [k]: toExtracted(v) }) : a),
      {}
    );
  }

  setSelection(data: Selection | undefined, error: ErrorLike): void {
    this._selection =
      data === undefined ? this._selection : { storyId: data.storyId, viewMode: data.viewMode };
    this._error = error === undefined ? this._error : error;

    setTimeout(() => {
      // preferred method to emit event.
      if (this._channel) {
        this._channel.emit(Events.STORY_RENDER);
      }

      // should be deprecated in future.
      this.emit(Events.STORY_RENDER);
    }, 1);
  }

  getSelection = (): Selection => this._selection;

  getError = (): ErrorLike | undefined => this._error;

  remove = (id: string): void => {
    const { _data } = this;
    const story = _data[id];
    delete _data[id];

    if (story) {
      const { kind, name } = story;
      const kindData = this._legacydata[toKey(kind)];
      if (kindData) {
        delete kindData.stories[toKey(name)];
      }
    }
  };

  addStory(
    { id, kind, name, storyFn: original, parameters = {} }: AddStoryArgs,
    {
      getDecorators,
      applyDecorators,
    }: {
      getDecorators: () => DecoratorFunction[];
      applyDecorators: (fn: StoryFn, decorators: DecoratorFunction[]) => any;
    }
  ) {
    const { _data } = this;

    if (_data[id]) {
      logger.warn(stripIndents`
        Story with id ${id} already exists in the store!

        Perhaps you added the same story twice, or you have a name collision?
        Story ids need to be unique -- ensure you aren't using the same names modolo url-sanitization.
      `);
    }

    const identification = {
      id,
      kind,
      name,
      story: name, // legacy
    };

    // immutable original storyFn
    const getOriginal = () => original;

    // lazily decorate the story when it's loaded
    const getDecorated: () => StoryFn = memoize(1)(() =>
      applyDecorators(getOriginal(), getDecorators())
    );

    const hooks = new HooksContext();

    const storyFn: StoryFn = p =>
      getDecorated()({
        ...identification,
        ...p,
        hooks,
        parameters: { ...parameters, ...(p && p.parameters) },
      });

    _data[id] = {
      ...identification,

      hooks,
      getDecorated,
      getOriginal,
      storyFn,

      parameters,
    };

    // LEGACY DATA
    if (!isStoryDocsOnly(parameters)) {
      this.addLegacyStory({ kind, name, storyFn, parameters });
    }

    // LET'S SEND IT TO THE MANAGER
    this.pushToManager();
  }

  pushToManager = debounce(() => {
    if (this._channel) {
      const stories = this.extract({ includeDocsOnly: true });

      // send to the parent frame.
      this._channel.emit(Events.SET_STORIES, { stories });
    }
  }, 0);

  // OLD apis
  getRevision() {
    return this._revision;
  }

  incrementRevision() {
    this._revision += 1;
  }

  addLegacyStory({
    kind,
    name,
    storyFn,
    parameters,
  }: {
    kind: string;
    name: string;
    storyFn: StoryFn;
    parameters: Parameters;
  }) {
    const k = toKey(kind);
    if (!this._legacydata[k as string]) {
      this._legacydata[k as string] = {
        kind,
        fileName: parameters.fileName,
        index: getId(),
        stories: {},
      };
    }

    this._legacydata[k as string].stories[toKey(name)] = {
      name,
      // kind,
      index: getId(),
      story: storyFn,
      parameters,
    };
  }

  getStoryKinds() {
    return Object.values(this._legacydata)
      .filter((kind: LegacyItem) => Object.keys(kind.stories).length > 0)
      .sort((info1: LegacyItem, info2: LegacyItem) => info1.index - info2.index)
      .map((info: LegacyItem) => info.kind);
  }

  getStories(kind: string) {
    const key = toKey(kind);

    if (!this._legacydata[key as string]) {
      return [];
    }

    return Object.keys(this._legacydata[key as string].stories)
      .map(name => this._legacydata[key as string].stories[name])
      .sort((info1, info2) => info1.index - info2.index)
      .map(info => info.name);
  }

  getStoriesForKind(kind: string) {
    return this.raw().filter(story => story.kind === kind);
  }

  getStoryFileName(kind: string) {
    const key = toKey(kind);
    const storiesKind = this._legacydata[key as string];
    if (!storiesKind) {
      return null;
    }

    return storiesKind.fileName;
  }

  getStoryAndParameters(kind: string, name: string) {
    if (!kind || !name) {
      return null;
    }

    const storiesKind = this._legacydata[toKey(kind) as string];
    if (!storiesKind) {
      return null;
    }

    const storyInfo = storiesKind.stories[toKey(name)];
    if (!storyInfo) {
      return null;
    }

    const { story, parameters } = storyInfo;
    return {
      story,
      parameters,
    };
  }

  getStory(kind: string, name: string) {
    const data = this.getStoryAndParameters(kind, name);
    return data && data.story;
  }

  getStoryWithContext(kind: string, name: string) {
    const data = this.getStoryAndParameters(kind, name);
    if (!data) {
      return null;
    }
    const { story } = data;
    return story;
  }

  removeStoryKind(kind: string) {
    if (this.hasStoryKind(kind)) {
      this._legacydata[toKey(kind)].stories = {};

      this._data = Object.entries(this._data).reduce((acc, [id, story]) => {
        if (story.kind !== kind) {
          Object.assign(acc, { [id]: story });
        }
        return acc;
      }, {});
      this.pushToManager();
    }
  }

  hasStoryKind(kind: string) {
    return Boolean(this._legacydata[toKey(kind) as string]);
  }

  hasStory(kind: string, name: string) {
    return Boolean(this.getStory(kind, name));
  }

  dumpStoryBook() {
    const data = this.getStoryKinds().map(kind => ({
      kind,
      stories: this.getStories(kind),
    }));

    return data;
  }

  size() {
    return Object.keys(this._legacydata).length;
  }

  clean() {
    this.getStoryKinds().forEach(kind => delete this._legacydata[toKey(kind) as string]);
  }

  cleanHooks(id: string) {
    this._data[id].hooks.clean();
  }

  cleanHooksForKind(kind: string) {
    this.getStoriesForKind(kind).map(story => this.cleanHooks(story.id));
  }
}
