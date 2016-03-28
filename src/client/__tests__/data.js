const { describe, it } = global;
import UUID from 'uuid';
import sinon from 'sinon';
import { expect } from 'chai';
import SyncedStore from '../data';

const currentDataId = UUID.v4();
const window = {
  location: {
    search: `?dataId=${currentDataId}`,
  },
  addEventListener() {},
};
const dataModule = new SyncedStore(window);
dataModule._bus = {};

describe('data', () => {
  // TODO: We can't find a way to reset the module cache.
  // Once we do that, we can test for this case as well.

  // describe('normal mode', () => {
  //   it('should set the `iframeMode` as false', () => {
  //     const data = dataModule.getData();
  //     expect(data.iframeMode).to.be.equal(false);
  //   });
  //   it('should set a random Id to dataId', () => {
  //     const data = dataModule.getData();
  //     expect(typeof data.dataId).to.be.equal('string');
  //   });
  // });

  describe('iframe mode', () => {
    it('should get the dataId from the URL', () => {
      const data = dataModule.getData();
      expect(data.dataId).to.be.equal(currentDataId);
    });

    it('should set the iframeMode as true', () => {
      const data = dataModule.getData();
      expect(data.iframeMode).to.be.equal(true);
    });
  });

  describe('watchData', () => {
    it('should add the handler to handlers', () => {
      const fn = () => {};
      dataModule.watchData(fn);
      const fnStored = dataModule._handlers.pop();
      expect(fnStored).to.be.equal(fn);
    });

    it('should remove the handler when the return function called', () => {
      const stop = dataModule.watchData(() => {});
      const countStart = dataModule._handlers.length;
      stop();
      const countEnd = dataModule._handlers.length;
      expect(countStart - countEnd).to.be.equal(1);
    });
  });

  describe('setData', () => {
    it('should emit data to the pageBus', () => {
      const kkr = UUID.v4();
      const originalEmit = dataModule._bus.emit;
      dataModule._bus.emit = sinon.stub();
      dataModule.setData({ kkr });
      const data = dataModule.getData();

      const sentString = dataModule._bus.emit.args[0][1];
      const sentJSON = JSON.parse(sentString);
      expect(sentJSON).to.deep.equal(data);
      dataModule._bus.emit = originalEmit;
    });

    it('should update existing data', () => {
      const kkr = UUID.v4();
      const originalEmit = dataModule._bus.emit;
      dataModule._bus.emit = sinon.stub();

      const previousKKR = dataModule.getData().kkr;
      dataModule.setData({ kkr });
      const data = dataModule.getData();

      expect(data.kkr).not.to.be.equal(previousKKR);
      dataModule._bus.emit = originalEmit;
    });

    it('should run all handlers with the data', (done) => {
      const kkr = UUID.v4();
      const stop = dataModule.watchData((data) => {
        stop();
        expect(data.kkr).to.be.equal(kkr);
        done();
      });

      const originalEmit = dataModule._bus.emit;
      dataModule._bus.emit = sinon.stub();
      dataModule.setData({ kkr });
      dataModule._bus.emit = originalEmit;
    });

    it('should add a property with __lastUpdated with Date.now()', () => {
      const now = UUID.v4();
      const originalEmit = dataModule._bus.emit;
      dataModule._bus.emit = sinon.stub();
      const originalNow = Date.now;
      Date.now = () => (now);

      dataModule.setData({ aa: 10 });
      const data = dataModule.getData();

      expect(data.__lastUpdated).to.be.equal(now);
      Date.now = originalNow;
      dataModule._bus.emit = originalEmit;
    });
  });

  describe('receiveData', () => {
    it('should set received data as the new data', () => {
      const previousData = dataModule.getData();
      const newData = { kkr: UUID.v4() };
      dataModule._onData(JSON.stringify(newData));

      const updatedData = dataModule.getData();
      delete updatedData.iframeMode;
      expect(updatedData).to.deep.equal(newData);
      expect(previousData).not.to.deep.equal(newData);
    });

    it('should run all handlers with data', (done) => {
      const newData = { kkr: UUID.v4() };
      const stop = dataModule.watchData((data) => {
        stop();
        const updatedData = { ...data };
        delete updatedData.iframeMode;
        expect(updatedData).to.deep.equal(newData);
        done();
      });

      dataModule._onData(JSON.stringify(newData));
    });

    it('should set the local iframeMode to data', () => {
      const newData = {
        kkr: UUID.v4(),
        iframeMode: UUID.v4(),
      };

      const oldIframeMode = dataModule.getData().iframeMode;
      dataModule._onData(JSON.stringify(newData));

      const newIframeMode = dataModule.getData().iframeMode;

      expect(newIframeMode).to.be.deep.equal(oldIframeMode);
    });
  });

  describe('getDataKey', () => {
    it('should get the data key prefixed with the current dataId', () => {
      const dataId = dataModule.getData().dataId;
      const dataKey = dataModule.getDataKey();
      expect(dataKey).to.be.equal(`data-${dataId}`);
    });
  });
});
