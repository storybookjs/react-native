const { describe, it } = global;
import UUID from 'uuid';
import sinon from 'sinon';
import { expect } from 'chai';
import SyncedStore from '../synced_store';

function getSyncedData(dataId) {
  const window = {
    location: {},
    addEventListener() {},
  };

  if (dataId) {
    window.location.search = `?dataId=${dataId}`;
  }

  const syncedData = new SyncedStore(window);
  syncedData._bus = {};

  return syncedData;
}

describe('data', () => {
  describe('normal mode', () => {
    it('should set the `iframeMode` as false', () => {
      const syncedData = getSyncedData();

      const data = syncedData.getData();
      expect(data.iframeMode).to.be.equal(false);
    });
    it('should set a random Id to dataId', () => {
      const syncedData = getSyncedData();

      const data = syncedData.getData();
      expect(typeof data.dataId).to.be.equal('string');
    });
  });

  describe('iframe mode', () => {
    it('should get the dataId from the URL', () => {
      const currentDataId = UUID.v4();
      const syncedData = getSyncedData(currentDataId);

      const data = syncedData.getData();
      expect(data.dataId).to.be.equal(currentDataId);
    });

    it('should set the iframeMode as true', () => {
      const syncedData = getSyncedData(UUID.v4());

      const data = syncedData.getData();
      expect(data.iframeMode).to.be.equal(true);
    });
  });

  describe('watchData', () => {
    it('should add the handler to handlers', () => {
      const syncedData = getSyncedData(UUID.v4());

      const fn = () => {};
      syncedData.watchData(fn);
      const fnStored = syncedData._handlers.pop();
      expect(fnStored).to.be.equal(fn);
    });

    it('should remove the handler when the return function called', () => {
      const syncedData = getSyncedData(UUID.v4());

      const stop = syncedData.watchData(() => {});
      const countStart = syncedData._handlers.length;
      stop();
      const countEnd = syncedData._handlers.length;
      expect(countStart - countEnd).to.be.equal(1);
    });
  });

  describe('setData', () => {
    it('should emit data to the pageBus', () => {
      const syncedData = getSyncedData(UUID.v4());

      const kkr = UUID.v4();
      const originalEmit = syncedData._bus.emit;
      syncedData._bus.emit = sinon.stub();
      syncedData.setData({ kkr });
      const data = syncedData.getData();

      const sentString = syncedData._bus.emit.args[0][1];
      const sentJSON = JSON.parse(sentString);
      expect(sentJSON).to.deep.equal(data);
      syncedData._bus.emit = originalEmit;
    });

    it('should update existing data', () => {
      const syncedData = getSyncedData(UUID.v4());

      const kkr = UUID.v4();
      const originalEmit = syncedData._bus.emit;
      syncedData._bus.emit = sinon.stub();

      const previousKKR = syncedData.getData().kkr;
      syncedData.setData({ kkr });
      const data = syncedData.getData();

      expect(data.kkr).not.to.be.equal(previousKKR);
      syncedData._bus.emit = originalEmit;
    });

    it('should run all handlers with the data', (done) => {
      const syncedData = getSyncedData(UUID.v4());

      const kkr = UUID.v4();
      const stop = syncedData.watchData((data) => {
        stop();
        expect(data.kkr).to.be.equal(kkr);
        done();
      });

      const originalEmit = syncedData._bus.emit;
      syncedData._bus.emit = sinon.stub();
      syncedData.setData({ kkr });
      syncedData._bus.emit = originalEmit;
    });

    it('should add a property with __lastUpdated with Date.now()', () => {
      const syncedData = getSyncedData(UUID.v4());

      const now = UUID.v4();
      const originalEmit = syncedData._bus.emit;
      syncedData._bus.emit = sinon.stub();
      const originalNow = Date.now;
      Date.now = () => (now);

      syncedData.setData({ aa: 10 });
      const data = syncedData.getData();

      expect(data.__lastUpdated).to.be.equal(now);
      Date.now = originalNow;
      syncedData._bus.emit = originalEmit;
    });
  });

  describe('receiveData', () => {
    it('should set received data as the new data', () => {
      const syncedData = getSyncedData(UUID.v4());

      const previousData = syncedData.getData();
      const newData = { kkr: UUID.v4() };
      syncedData._onData(JSON.stringify(newData));

      const updatedData = syncedData.getData();
      delete updatedData.iframeMode;
      expect(updatedData).to.deep.equal(newData);
      expect(previousData).not.to.deep.equal(newData);
    });

    it('should run all handlers with data', (done) => {
      const syncedData = getSyncedData(UUID.v4());

      const newData = { kkr: UUID.v4() };
      const stop = syncedData.watchData((data) => {
        stop();
        const updatedData = { ...data };
        delete updatedData.iframeMode;
        expect(updatedData).to.deep.equal(newData);
        done();
      });

      syncedData._onData(JSON.stringify(newData));
    });

    it('should set the local iframeMode to data', () => {
      const syncedData = getSyncedData(UUID.v4());

      const newData = {
        kkr: UUID.v4(),
        iframeMode: UUID.v4(),
      };

      const oldIframeMode = syncedData.getData().iframeMode;
      syncedData._onData(JSON.stringify(newData));

      const newIframeMode = syncedData.getData().iframeMode;

      expect(newIframeMode).to.be.deep.equal(oldIframeMode);
    });
  });

  describe('getDataKey', () => {
    it('should get the data key prefixed with the current dataId', () => {
      const syncedData = getSyncedData(UUID.v4());

      const dataId = syncedData.getData().dataId;
      const dataKey = syncedData.getDataKey();
      expect(dataKey).to.be.equal(`data-${dataId}`);
    });
  });
});
