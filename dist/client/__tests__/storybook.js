'use strict';

var _chai = require('chai');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _storybook = require('../storybook');

var _storybook2 = _interopRequireDefault(_storybook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _global = global;
var describe = _global.describe;
var it = _global.it;
var beforeEach = _global.beforeEach;

var storybook = new _storybook2.default();

describe('client.storybook', function () {
  beforeEach(function () {
    return storybook.clean();
  });

  describe('storybook.addStory', function () {
    it('should add the first story properly', function () {
      var kind = _uuid2.default.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      (0, _chai.expect)(storybook.getStory(kind, 'name')).to.be.equal(story);
    });

    it('should add another story of the previous kind', function () {
      var kind = _uuid2.default.v4();
      function story1() {}
      function story2() {}
      storybook.addStory(kind, 'name1', story1);
      storybook.addStory(kind, 'name2', story2);

      (0, _chai.expect)(storybook.getStory(kind, 'name1')).to.be.equal(story1);
      (0, _chai.expect)(storybook.getStory(kind, 'name2')).to.be.equal(story2);
    });

    it('should replace the same story if came again', function () {
      var kind = _uuid2.default.v4();
      function story1() {}
      function story2() {}
      storybook.addStory(kind, 'name', story1);
      storybook.addStory(kind, 'name', story2);

      (0, _chai.expect)(storybook.getStory(kind, 'name')).to.be.equal(story2);
    });
  });

  describe('storybook.getStoryKinds', function () {
    it('should return all story kind names with FIFO order', function () {
      var kind1 = _uuid2.default.v4();
      var kind2 = _uuid2.default.v4();
      var kind3 = _uuid2.default.v4();
      function story() {}

      storybook.addStory(kind1, 'name', story);
      storybook.addStory(kind2, 'name', story);
      storybook.addStory(kind3, 'name', story);

      (0, _chai.expect)(storybook.getStoryKinds()).to.deep.equal([kind1, kind2, kind3]);
    });
  });

  describe('storybook.getStories', function () {
    it('should return an empty array, if there is no kind', function () {
      var kind = _uuid2.default.v4();
      (0, _chai.expect)(storybook.getStories(kind)).to.deep.equal([]);
    });

    it('should return all story names with FIFO order', function () {
      var kind = _uuid2.default.v4();
      function story() {}

      storybook.addStory(kind, 'name1', story);
      storybook.addStory(kind, 'name2', story);
      storybook.addStory(kind, 'name3', story);

      (0, _chai.expect)(storybook.getStories(kind)).to.deep.equal(['name1', 'name2', 'name3']);
    });
  });

  describe('storybook.getStory', function () {
    it('should return null if there is no kind', function () {
      var kind = _uuid2.default.v4();
      (0, _chai.expect)(storybook.getStory(kind, 'name')).to.be.equal(null);
    });

    it('should return null if there is no story', function () {
      var kind = _uuid2.default.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      (0, _chai.expect)(storybook.getStory(kind, 'other-name')).to.be.equal(null);
    });

    it('shodld return the story if exists', function () {
      var kind = _uuid2.default.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      (0, _chai.expect)(storybook.getStory(kind, 'name')).to.be.equal(story);
    });
  });

  describe('storybook.removeStoryKind', function () {
    it('should remove the given kind', function () {
      var kind = _uuid2.default.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);
      (0, _chai.expect)(storybook.getStory(kind, 'name')).to.be.equal(story);

      storybook.removeStoryKind(kind);

      (0, _chai.expect)(storybook.getStory(kind, 'name')).to.be.equal(null);
    });
  });

  describe('storybook.hasStoryKind', function () {
    it('should return true if there is a kind', function () {
      var kind = _uuid2.default.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      (0, _chai.expect)(storybook.hasStoryKind(kind)).to.be.equal(true);
    });

    it('should return false if there is no kind', function () {
      var kind = _uuid2.default.v4();
      (0, _chai.expect)(storybook.hasStoryKind(kind)).to.be.equal(false);
    });
  });

  describe('storybook.hasStory', function () {
    it('should return true if there is a story', function () {
      var kind = _uuid2.default.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      (0, _chai.expect)(storybook.hasStory(kind, 'name')).to.be.equal(true);
    });

    it('should return false if there is no kind', function () {
      var kind = _uuid2.default.v4();
      (0, _chai.expect)(storybook.hasStoryKind(kind, 'name')).to.be.equal(false);
    });

    it('should return false if there is no story', function () {
      var kind = _uuid2.default.v4();
      function story() {}
      storybook.addStory(kind, 'name', story);

      (0, _chai.expect)(storybook.hasStory(kind, 'name2')).to.be.equal(false);
    });
  });

  describe('storybook.dumpStoryBook', function () {
    it('should dump all story kinds and stories properly', function () {
      var kind1 = _uuid2.default.v4();
      var kind2 = _uuid2.default.v4();
      function story() {}

      storybook.addStory(kind1, 'name1', story);
      storybook.addStory(kind1, 'name2', story);
      storybook.addStory(kind2, 'name10', story);
      storybook.addStory(kind2, 'name20', story);

      (0, _chai.expect)(storybook.dumpStoryBook()).to.be.deep.equal([{ kind: kind1, stories: ['name1', 'name2'] }, { kind: kind2, stories: ['name10', 'name20'] }]);
    });
  });
});