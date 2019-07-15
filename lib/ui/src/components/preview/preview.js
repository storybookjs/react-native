import window from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';
import copy from 'copy-to-clipboard';

import { styled } from '@storybook/theming';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import { types } from '@storybook/addons';
import { Icons, IconButton, TabButton, TabBar, Separator } from '@storybook/components';

import { Helmet } from 'react-helmet-async';

import { Toolbar } from './toolbar';

import * as S from './components';

import { ZoomProvider, ZoomConsumer, Zoom } from './zoom';

import { IFrame } from './iframe';

const DesktopOnly = styled.span({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none',
  },
});
const stringifyQueryParams = queryParams =>
  Object.entries(queryParams).reduce((acc, [k, v]) => {
    return `${acc}&${k}=${v}`;
  }, '');

const renderIframe = (storyId, viewMode, id, baseUrl, scale, queryParams) => (
  <IFrame
    key="iframe"
    id="storybook-preview-iframe"
    title={id || 'preview'}
    src={`${baseUrl}?id=${storyId}&viewMode=${viewMode}${stringifyQueryParams(queryParams)}`}
    allowFullScreen
    scale={scale}
  />
);

const getElementList = memoize(10)((getFn, type, base) => base.concat(Object.values(getFn(type))));

const ActualPreview = ({
  wrappers,
  viewMode,
  id,
  storyId,
  active,
  baseUrl,
  scale,
  queryParams,
  customCanvas,
}) => {
  const data = [storyId, viewMode, id, baseUrl, scale, queryParams];
  const base = customCanvas ? customCanvas(...data) : renderIframe(...data);

  return wrappers.reduceRight(
    (acc, wrapper, index) => wrapper.render({ index, children: acc, id, storyId, active }),
    base
  );
};

const IframeWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  background: theme.background.content,
}));

const defaultWrappers = [
  {
    render: p => (
      <IframeWrapper id="storybook-preview-wrapper" hidden={!p.active}>
        {p.children}
      </IframeWrapper>
    ),
  },
];

const getTools = memoize(10)(
  (getElements, queryParams, panels, api, options, storyId, viewMode, location, path, baseUrl) => {
    const tools = getElementList(getElements, types.TOOL, [
      panels.filter(p => p.id !== 'canvas').length
        ? {
            render: () => (
              <Fragment>
                <TabBar key="tabs" scroll={false}>
                  {panels.map((t, index) => {
                    const to = t.route({ storyId, viewMode, path, location });
                    const isActive = path === to;
                    return (
                      <S.UnstyledLink key={t.id || `l${index}`} to={to}>
                        <TabButton active={isActive}>{t.title}</TabButton>
                      </S.UnstyledLink>
                    );
                  })}
                </TabBar>
                <Separator />
              </Fragment>
            ),
          }
        : null,
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <Fragment>
            <ZoomConsumer>
              {({ set, value }) => (
                <Zoom key="zoom" current={value} set={v => set(value * v)} reset={() => set(1)} />
              )}
            </ZoomConsumer>
            <Separator />
          </Fragment>
        ),
      },
    ]);

    const extraTools = getElementList(getElements, types.TOOLEXTRA, [
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <DesktopOnly>
            <IconButton
              key="full"
              onClick={api.toggleFullscreen}
              title={options.isFullscreen ? 'Exit full screen' : 'Go full screen'}
            >
              <Icons icon={options.isFullscreen ? 'close' : 'expand'} />
            </IconButton>
          </DesktopOnly>
        ),
      },
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <IconButton
            key="opener"
            onClick={() =>
              window.open(`${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`)
            }
            title="Open canvas in new tab"
          >
            <Icons icon="share" />
          </IconButton>
        ),
      },
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <IconButton
            key="copy"
            onClick={() =>
              copy(
                `${window.location.origin}${
                  window.location.pathname
                }${baseUrl}?id=${storyId}${stringifyQueryParams(queryParams)}`
              )
            }
            title="Copy canvas link"
          >
            <Icons icon="copy" />
          </IconButton>
        ),
      },
    ]);

    const filter = item =>
      item && (!item.match || item.match({ storyId, viewMode, location, path }));

    const displayItems = list =>
      list.reduce(
        (acc, item, index) =>
          item ? (
            <Fragment key={item.id || item.key || `f-${index}`}>
              {acc}
              {item.render() || item}
            </Fragment>
          ) : (
            acc
          ),
        null
      );

    const left = displayItems(tools.filter(filter));
    const right = displayItems(extraTools.filter(filter));

    return { left, right };
  }
);

class Preview extends Component {
  shouldComponentUpdate({ storyId, viewMode, options, queryParams }) {
    const { props } = this;

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      options.isToolshown !== props.options.isToolshown ||
      viewMode !== props.viewMode ||
      storyId !== props.storyId ||
      queryParams !== props.queryParams
    );
  }

  componentDidUpdate(prevProps) {
    const { api, storyId, viewMode } = this.props;
    const { storyId: prevStoryId, viewMode: prevViewMode } = prevProps;
    if ((storyId && storyId !== prevStoryId) || (viewMode && viewMode !== prevViewMode)) {
      api.emit(SET_CURRENT_STORY, { storyId, viewMode });
    }
  }

  render() {
    const {
      id,
      path,
      location,
      viewMode,
      storyId,
      queryParams,
      getElements,
      api,
      customCanvas,
      options,
      description,
      baseUrl,
    } = this.props;

    const toolbarHeight = options.isToolshown ? 40 : 0;

    const wrappers = getElementList(getElements, types.PREVIEW, defaultWrappers);
    const panels = getElementList(getElements, types.TAB, [
      {
        route: p => `/story/${p.storyId}`,
        match: p => p.viewMode && p.viewMode.match(/^(story|docs)$/),
        render: p => (
          <ZoomConsumer>
            {({ value }) => {
              const props = {
                viewMode,
                active: p.active,
                wrappers,
                id,
                storyId,
                baseUrl,
                queryParams,
                scale: value,
                customCanvas,
              };

              return <ActualPreview {...props} />;
            }}
          </ZoomConsumer>
        ),
        title: 'Canvas',
        id: 'canvas',
      },
    ]);
    const { left, right } = getTools(
      getElements,
      queryParams,
      panels,
      api,
      options,
      storyId,
      viewMode,
      location,
      path,
      baseUrl
    );

    return (
      <ZoomProvider>
        <Fragment>
          {id === 'main' && (
            <Helmet key="description">
              <title>{description ? `${description} ⋅ ` : ''}Storybook</title>
            </Helmet>
          )}
          <Toolbar key="toolbar" shown={options.isToolshown} border>
            <Fragment key="left">{left}</Fragment>
            <Fragment key="right">{right}</Fragment>
          </Toolbar>
          <S.FrameWrap key="frame" offset={toolbarHeight}>
            {panels.map(p => (
              <Fragment key={p.id || p.key}>
                {p.render({ active: p.match({ storyId, viewMode, location, path }) })}
              </Fragment>
            ))}
          </S.FrameWrap>
        </Fragment>
      </ZoomProvider>
    );
  }
}
Preview.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  customCanvas: PropTypes.func,
  api: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
    emit: PropTypes.func,
    toggleFullscreen: PropTypes.func,
  }).isRequired,
  storyId: PropTypes.string,
  path: PropTypes.string,
  viewMode: PropTypes.oneOf(['story', 'info', 'docs', 'settings']),
  location: PropTypes.shape({}).isRequired,
  getElements: PropTypes.func.isRequired,
  queryParams: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool,
    isToolshown: PropTypes.bool,
  }).isRequired,
  baseUrl: PropTypes.string,
};

Preview.defaultProps = {
  viewMode: undefined,
  storyId: undefined,
  path: undefined,
  description: undefined,
  baseUrl: 'iframe.html',
  customCanvas: undefined,
};

export { Preview };
