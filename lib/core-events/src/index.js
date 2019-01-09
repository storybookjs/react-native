"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events;
(function (events) {
    events["CHANNEL_CREATED"] = "channelCreated";
    events["GET_CURRENT_STORY"] = "getCurrentStory";
    events["SET_CURRENT_STORY"] = "setCurrentStory";
    events["GET_STORIES"] = "getStories";
    events["SET_STORIES"] = "setStories";
    events["SELECT_STORY"] = "selectStory";
    events["APPLY_SHORTCUT"] = "applyShortcut";
    events["STORY_ADDED"] = "storyAdded";
    events["FORCE_RE_RENDER"] = "forceReRender";
    events["REGISTER_SUBSCRIPTION"] = "registerSubscription";
    events["STORY_RENDERED"] = "storyRendered";
    events["STORY_ERRORED"] = "storyErrored";
    events["STORY_THREW_EXCEPTION"] = "storyThrewException";
})(events || (events = {}));
exports.default = events;
