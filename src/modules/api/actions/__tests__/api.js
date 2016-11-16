import actions from '../api';
import { expect } from 'chai';
import sinon from 'sinon';
import { types } from '../';
const { describe, it } = global;

describe('manager.api.actions.api', () => {
  describe('setStories', () => {
    describe('no selected story', () => {
      it('should set stories and select the first story');
    });

    describe('has a selected story', () => {
      it('should set stories and select the existing story');
    });

    describe('has a selected story, but it\'s story isn\'t in new stories', () => {
      it('should set stories and select the first story of the selected kind');
    });

    describe('has a selected story, but it\'s kind isn\'t in new stories', () => {
      it('should set stories and select the first story');
    });
  });

  describe('selectStory', () => {
    describe('with both kind and story', () => {
      it('should select the correct story');
    });

    describe('with just the kind', () => {
      it('should select the first of the kind');
    });
  });

  describe('jumpToStory', () => {
    describe('has enough stories', () => {
      it('should select the next story');
      it('should select the prev story');
    });

    describe('has not enough stories', () => {
      it('should select the current story');
    });
  });

  describe('setOptions', () => {
    it('should update options');
    it('should only update options for the key already defined');
  });

  describe('setQueryParams', () => {
    it('shodul update query params');
    it('should delete the param if it\'s null');
  });
});
