import Preview from './preview';
import qs from 'qs';
import UUID from 'uuid';
import React from 'react';
import createPageBus from 'page-bus';

export default class ReactProvider {
  constructor() {
    this.dataId = UUID.v4();
  }

  renderPreview(selectedKind, selectedStory) {
    const queryParams = {
      dataId: this.dataId,
      selectedKind,
      selectedStory,
    };

    const queryString = qs.stringify(queryParams);
    const url = `iframe.html?${queryString}`;
    return (
      <Preview url={url} />
    );
  }

  handleAPI(api) {
    const dataId = this.dataId;
    const bus = createPageBus();

    api.onStory(function (kind, story) {
      const payload = {
        kind,
        story,
      };

      bus.emit(`${dataId}.setCurrentStory`, JSON.stringify(payload));
    });

    // watch pageBus and put both actions and stories.
    bus.on(`${dataId}.addAction`, function (payload) {
      const data = JSON.parse(payload);
      api.addAction(data.action);
    });

    bus.on(`${dataId}.setStories`, function (payload) {
      const data = JSON.parse(payload);
      api.setStories(data.stories);
    });

    bus.on(`${dataId}.selectStory`, function (payload) {
      const data = JSON.parse(payload);
      api.selectStory(data.kind, data.story);
    });

    bus.on(`${dataId}.applyShortcut`, function (payload) {
      const data = JSON.parse(payload);
      api.handleShortcut(data.event);
    });
  }
}
