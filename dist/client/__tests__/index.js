'use strict';

var _chai = require('chai');

var _global = global;
var describe = _global.describe;
var it = _global.it;


describe('client.index', function () {
  describe('storiesOf', function () {
    it('should add the story to storybox');
    it('should return .add method');
    it('should return .add method even called .add');
    it('should remove story kind on hot module dispose');
  });

  describe('action', function () {
    it('should push the action to existing actions');
    it('should only keep recent 5 actions');
    it('should replace Synthetic events with their name');
  });

  describe('renderError', function () {
    it('should set error stack and message into data.setData');
  });

  describe('renderMain', function () {
    it('should run loaders');
    it('should call data.setData with the storybook dump');
    it('should call data.setData with the __updatedAt');
    it('should reset data.error');

    describe('current selectedKind is not available', function () {
      it('should select selectedKind from the first storykind');
    });

    describe('there is a selectedKind in storybook', function () {
      describe('current selectedStory is not available', function () {
        it('should select selectedStory from the first story');
      });
    });
  });

  describe('configure', function () {
    describe('immediately', function () {
      it('should run renderMain');
      it('should run renderError if there was an error running renderMain');
    });

    describe('on hot reload', function () {
      it('should run renderMain');
      it('should run renderError if there was an error running renderMain');
    });
  });
});