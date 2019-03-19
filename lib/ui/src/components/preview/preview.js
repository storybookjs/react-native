import window from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { styled } from '@storybook/theming';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import { types } from '@storybook/addons';
import { Icons, IconButton, TabButton, TabBar, Separator } from '@storybook/components';

import Helmet from 'react-helmet-async';

import { Toolbar } from './toolbar';

import * as S from './components';

import { ZoomProvider, ZoomConsumer, Zoom } from './zoom';
import { Grid, Background, BackgroundProvider, BackgroundConsumer } from './background';

import { IFrame } from './iframe';

const DesktopOnly = styled.span({
  // Hides full screen icon at mobile breakpoint defined in app.js
  '@media (max-width: 599px)': {
    display: 'none',
  },
});

const renderIframe = (storyId, id, baseUrl) => (
  <IFrame
    key="iframe"
    id="storybook-preview-iframe"
    title={id || 'preview'}
    src={`${baseUrl}?id=${storyId}`}
    allowFullScreen
  />
);

const getElementList = memoize(10)((getFn, type, base) => base.concat(Object.values(getFn(type))));

const ActualPreview = ({ wrappers, id, storyId, active, baseUrl }) =>
  wrappers.reduceRight(
    (acc, wrapper, index) => wrapper.render({ index, children: acc, id, storyId, active }),
    renderIframe(storyId, id, baseUrl)
  );

const defaultWrappers = [
  { render: p => <div hidden={!p.active}>{p.children}</div> },
  {
    render: p => (
      <BackgroundConsumer>
        {({ value, grid }) => (
          <Background id="storybook-preview-background" value={value}>
            {grid ? <Grid /> : null}
            {p.children}
          </Background>
        )}
      </BackgroundConsumer>
    ),
  },
  {
    render: p => (
      <ZoomConsumer>
        {({ value }) => (
          <S.Frame
            style={{
              width: `${100 * value}%`,
              height: `${100 * value}%`,
              transform: `scale(${1 / value})`,
            }}
          >
            {p.children}
          </S.Frame>
        )}
      </ZoomConsumer>
    ),
  },
];

const getTools = memoize(10)(
  (getElements, panels, actions, options, storyId, viewMode, location, path, baseUrl) => {
    const tools = getElementList(getElements, types.TOOL, [
      panels.filter(p => p.id !== 'canvas').length
        ? {
            render: () => (
              <Fragment>
                <TabBar key="tabs" scroll={false}>
                  {panels.map((t, index) => {
                    const to = t.route({ storyId, viewMode, path, location });
                    const isActive = t.match({ storyId, viewMode, path, location });
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
      {
        match: p => p.viewMode === 'story',
        render: () => (
          <BackgroundConsumer>
            {({ setGrid, grid }) => (
              <IconButton
                active={!!grid}
                key="grid"
                onClick={() => setGrid(!grid)}
                title="Toggle background grid"
              >
                <Icons icon="grid" />
              </IconButton>
            )}
          </BackgroundConsumer>
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
              onClick={actions.toggleFullscreen}
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
            onClick={() => window.open(`${baseUrl}?id=${storyId}`)}
            title="Open canvas in new tab"
          >
            <Icons icon="share" />
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
  shouldComponentUpdate({ storyId, viewMode, options }) {
    const { props } = this;

    return (
      options.isFullscreen !== props.options.isFullscreen ||
      options.isToolshown !== props.options.isToolshown ||
      viewMode !== props.viewMode ||
      storyId !== props.storyId
    );
  }

  componentDidUpdate(prevProps) {
    const { api, storyId } = this.props;
    const { storyId: prevStoryId } = prevProps;
    if (storyId && storyId !== prevStoryId) {
      api.emit(SET_CURRENT_STORY, { storyId });
    }
  }

  render() {
    const {
      id,
      path,
      location,
      viewMode,
      storyId,
      getElements,
      actions,
      options,
      description,
      baseUrl,
    } = this.props;

    const toolbarHeight = options.isToolshown ? 40 : 0;

    const wrappers = getElementList(getElements, types.PREVIEW, defaultWrappers);
    const panels = getElementList(getElements, types.TAB, [
      {
        route: p => `/story/${p.storyId}`,
        match: p => p.viewMode === 'story',
        render: p => (
          <ActualPreview
            active={p.active}
            wrappers={wrappers}
            id={id}
            storyId={storyId}
            baseUrl={baseUrl}
          />
        ),
        title: 'Canvas',
        id: 'canvas',
      },
    ]);
    const { left, right } = getTools(
      getElements,
      panels,
      actions,
      options,
      storyId,
      viewMode,
      location,
      path,
      baseUrl
    );

    return (
      <BackgroundProvider>
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
      </BackgroundProvider>
    );
  }
}
Preview.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  api: PropTypes.shape({
    on: PropTypes.func,
    off: PropTypes.func,
    emit: PropTypes.func,
  }).isRequired,
  storyId: PropTypes.string,
  path: PropTypes.string,
  viewMode: PropTypes.oneOf(['story', 'info']),
  location: PropTypes.shape({}).isRequired,
  getElements: PropTypes.func.isRequired,
  options: PropTypes.shape({
    isFullscreen: PropTypes.bool,
    isToolshown: PropTypes.bool,
  }).isRequired,
  actions: PropTypes.shape({}).isRequired,
  baseUrl: PropTypes.string,
};
Preview.defaultProps = {
  viewMode: undefined,
  storyId: undefined,
  path: undefined,
  description: undefined,
  baseUrl: 'iframe.html',
};

export { Preview };
