import React, { Fragment, useMemo, ReactElement } from 'react';

import { useParameter, useAddonState, useStorybookState } from '@storybook/api';
import { styled } from '@storybook/theming';
import { ActionBar } from '@storybook/components';
import { PARAM_KEY, ADDON_ID } from './constants';

interface AssetDescription {
  url: string;
  name: string;
}

type Results = (string | AssetDescription)[];
type Selected = number;

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }: { url: string | undefined }): ReactElement => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }
  if (url.match(/\.(mp4|ogv|webm)/)) {
    // do video viewer
    return <div>not implemented yet, sorry</div>;
  }

  return <Iframe title={url} src={url} />;
};

const getUrl = (input: AssetDescription | string): string => {
  return typeof input === 'string' ? input : input.url;
};

export const Panel = () => {
  const results = useParameter<Results>(PARAM_KEY, []);
  const [selected, setSelected] = useAddonState<Selected>(ADDON_ID, 0);
  const { storyId } = useStorybookState();

  return useMemo(() => {
    if (results.length === 0) {
      return null;
    }

    if (results.length && !results[selected]) {
      setSelected(0);
      return null;
    }
    const url = getUrl(results[selected]).replace('{id}', storyId);
    return (
      <Fragment>
        <Asset url={url} />
        {results.length > 1 ? (
          <ActionBar
            key="actionbar"
            actionItems={results.map((i, index) => ({
              title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
              onClick: () => setSelected(index),
            }))}
          />
        ) : null}
      </Fragment>
    );
  }, [results, selected, storyId]);
};
