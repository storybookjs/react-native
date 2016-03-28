const { describe, it } = global;
import { expect } from 'chai';

describe('client.ConfigApi', () => {
  describe('_renderError', () => {
    it('should send error stack and message to syncedStore');
  });

  describe('_renderMain', () => {
    it('should run loaders if provided');
    it('should set error in syncedStore to null');
    it('should get a dump of storyStore and send it to syncedStore');
    it('should set __updatedAt field with a updated value to syncedStore');
    it('should select a new kind if the current one is not available');
    describe('if there is kind', () => {
      it('should select a new story if the current one is not available');
    });
  });

  describe('configure', () => {
    describe('initially', () => {
      it('should call _renderMain with loaders');
      describe('if caused an error', () => {
        it('should call _renderError with the error');
      });
    });

    describe('with hot reload', () => {
      it('should call _renderMain with loaders');
      describe('if caused an error', () => {
        it('should call _renderError with the error');
      });
    });
  });
});
