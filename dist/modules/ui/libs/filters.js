'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storyFilter = storyFilter;
function storyFilter(stories, filter, selectedKind) {
  if (!stories) return null;
  if (!filter) return stories;

  return stories.filter(function (kindInfo) {
    if (kindInfo.kind === selectedKind) return true;

    var regExp = new RegExp(filter, 'ig');
    return kindInfo.kind.match(regExp);
  });
}