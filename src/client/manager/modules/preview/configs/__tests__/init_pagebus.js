import initPageBus from '../init_pagebus';
import { expect } from 'chai';
const { describe, it } = global;
import sinon from 'sinon';
import { EventEmitter } from 'events';

describe('manager.preview.config.initPageBus', () => {
  it('should send currentStory to the iframe', (done) => {
    const dataId = 'dasds';
    const kind = 'fdfd';
    const story = 'dfdfdf';

    const bus = {
      on() {},
      emit: sinon.stub(),
    };

    const reduxStore = {
      subscribe: (cb) => {
        setTimeout(cb, 10);
      },
      getState: () => ({
        api: {
          selectedKind: kind,
          selectedStory: story,
        },
        core: {
          dataId,
        },
      }),
    };

    initPageBus(bus, reduxStore);

    setTimeout(() => {
      const event = bus.emit.args[0][0];
      const payload = JSON.parse(bus.emit.args[0][1]);

      expect(event).to.be.equal(`${dataId}.setCurrentStory`);
      expect(payload).to.deep.equal({ kind, story });
      done();
    }, 20);
  });

  it('should send nothing to iframe if no preview data', (done) => {
    const dataId = 'dasds';

    const bus = {
      on() {},
      emit: sinon.stub(),
    };

    const reduxStore = {
      subscribe: (cb) => {
        setTimeout(cb, 10);
      },
      getState: () => ({
        core: {
          dataId,
        },
      }),
    };

    initPageBus(bus, reduxStore);

    setTimeout(() => {
      expect(bus.emit.callCount).to.be.equal(0);
      done();
    }, 20);
  });

  it('should call actions.preview.addAction', (done) => {
    const dataId = 'dasds';
    const bus = new EventEmitter();
    const reduxStore = {
      subscribe() {},
      getState: () => ({
        core: {
          dataId,
        },
      }),
    };

    const action = { aa: 10 };
    const actions = {
      api: {
        addAction(a) {
          expect(a).to.deep.equal(action);
          done();
        },
      },
    };

    initPageBus(bus, reduxStore, actions);
    bus.emit(`${dataId}.addAction`, JSON.stringify({ action }));
  });

  it('should call actions.preview.setStories', (done) => {
    const dataId = 'dasds';
    const bus = new EventEmitter();
    const reduxStore = {
      subscribe() {},
      getState: () => ({
        core: {
          dataId,
        },
      }),
    };
    const stories = [{ kind: 'aa' }];

    const actions = {
      api: {
        setStories(s) {
          expect(s).to.deep.equal(stories);
          done();
        },
      },
    };

    initPageBus(bus, reduxStore, actions);
    bus.emit(`${dataId}.setStories`, JSON.stringify({ stories }));
  });

  it('should dispatch SELECT_STORY', (done) => {
    const dataId = 'dasds';
    const bus = new EventEmitter();
    const reduxStore = {
      subscribe() {},
      getState: () => ({
        core: {
          dataId,
        },
      }),
    };

    const kind = 'kk';
    const story = 'ss';

    const actions = {
      api: {
        selectStory(k, s) {
          expect(k).to.be.equal(kind);
          expect(s).to.be.equal(story);
          done();
        },
      },
    };

    initPageBus(bus, reduxStore, actions);
    bus.emit(`${dataId}.selectStory`, JSON.stringify({ kind, story }));
  });

  it('should call actions.shortcuts.handleEvent', (done) => {
    const dataId = 'dasds';
    const bus = new EventEmitter();
    const reduxStore = {
      subscribe() {},
      getState: () => ({
        core: {
          dataId,
        },
      }),
    };
    const event = 1;

    const actions = {
      shortcuts: {
        handleEvent(e) {
          expect(e).to.be.equal(event);
          done();
        },
      },
    };

    initPageBus(bus, reduxStore, actions);
    bus.emit(`${dataId}.applyShortcut`, JSON.stringify({ event }));
  });
});
