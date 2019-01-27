import { window } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { SET_CURRENT_STORY } from '@storybook/core-events';
import { types } from '@storybook/addons';

import Helmet from 'react-helmet-async';

import { IconButton, Toolbar, Separator, Spacer } from './toolbar';
import Icons from '../icon/icon';
import { TabButton, TabBar } from '../tabs/tabs';

import Zoom from './tools/zoom';
import { Grid, Background } from './tools/background';
import * as S from './components';

import { ZoomProvider, ZoomConsumer } from './zoom';
import { BackgroundProvider, BackgroundConsumer } from './background';

import { IFrame } from './iframe';

const renderIframe = ({ storyId, id }) => (
  <IFrame
    key="iframe"
    id="storybook-preview-iframe"
    title={id || 'preview'}
    src={`iframe.html?id=${storyId}`}
    allowFullScreen
  />
);

const getElementList = memoize(10)((getFn, type, base) => base.concat(Object.values(getFn(type))));

const ActualPreview = ({ wrappers, id, storyId, active }) =>
  wrappers.reduceRight(
    (acc, wrapper, index) => wrapper.render({ index, children: acc, id, storyId, active }),
    renderIframe({ id, storyId })
  );

const defaultWrappers = [
  { render: ({ children, active }) => <div hidden={!active}>{children}</div> },
  {
    render: ({ children }) => (
      <BackgroundConsumer>
        {({ value, grid }) => (
          <Background id="storybook-preview-background" value={value}>
            {grid ? <Grid /> : null}
            {children}
          </Background>
        )}
      </BackgroundConsumer>
    ),
  },
  {
    render: ({ children }) => (
      <ZoomConsumer>
        {({ value }) => (
          <S.Frame
            style={{
              width: `${100 * value}%`,
              height: `${100 * value}%`,
              transform: `scale(${1 / value})`,
            }}
          >
            {children}
          </S.Frame>
        )}
      </ZoomConsumer>
    ),
  },
];

const RightTools = () => <Fragment />;

// eslint-disable-next-line react/no-multi-comp
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
    } = this.props;

    const toolbarHeight = options.isToolshown ? 41 : 0;

    const wrappers = getElementList(getElements, types.PREVIEW, defaultWrappers);
    const panels = getElementList(getElements, types.TAB, [
      {
        route: ({ storyId }) => `/story/${storyId}`,
        match: ({ viewMode }) => viewMode === 'story',
        render: ({ active, id, storyId }) => (
          <ActualPreview active={active} wrappers={wrappers} id={id} storyId={storyId} />
        ),
        title: 'Canvas',
        key: 'canvas',
      },
    ]);
    const tools = getElementList(getElements, types.TOOL, [
      {
        render: () => (
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
        ),
      },
      {
        match: ({ viewmode }) => viewMode === 'story',
        render: () => (
          <ZoomConsumer>
            {({ set, value }) => (
              <Zoom key="zoom" current={value} set={v => set(value * v)} reset={() => set(1)} />
            )}
          </ZoomConsumer>
        ),
      },
      {
        match: ({ viewmode }) => viewMode === 'story',
        render: () => (
          <BackgroundConsumer>
            {({ setGrid, grid }) => (
              <IconButton active={!!grid} key="grid" onClick={() => setGrid(!grid)}>
                <Icons icon="grid" />
              </IconButton>
            )}
          </BackgroundConsumer>
        ),
      },
    ]);
    const extraTools = [
      {
        match: ({ viewmode }) => viewMode === 'story',
        render: () => (
          <IconButton key="full" onClick={actions.toggleFullscreen}>
            <Icons icon={options.isFullscreen ? 'cross' : 'expand'} />
          </IconButton>
        ),
      },
      {
        match: ({ viewmode }) => viewMode === 'story',
        render: () => (
          <IconButton key="opener" onClick={() => window.open(`iframe.html?id=${storyId}`)}>
            <Icons icon="share" />
          </IconButton>
        ),
      },
    ];

    const left = tools
      .filter(item => !item.match || item.match({ storyId, viewMode, location, path }))
      .reduce((acc, item, index) => {
        const content = item.render();

        return content ? (
          <Fragment key={item.id || item.key || `tool-${index}`}>
            {acc}
            {index > 0 ? <Separator title={index} key={`separator-${index}`} /> : null}
            {content}
          </Fragment>
        ) : (
          acc
        );
      }, '');

    const right = extraTools
      .filter(item => !item.match || item.match({ storyId, viewMode, location, path }))
      .reduce((acc, item, index) => {
        const content = item.render();

        return content ? (
          <Fragment key={item.id || item.key || `tool-${index}`}>
            {acc}
            {index > 0 ? <Separator title={index} key={`separator-${index}`} /> : null}
            {content}
          </Fragment>
        ) : (
          acc
        );
      }, '');

    return (
      <BackgroundProvider>
        <ZoomProvider>
          <Fragment>
            {id === 'main' && (
              <Helmet key="description">
                <title>{description ? `${description} ⋅ ` : ''}Storybook</title>
              </Helmet>
            )}
            <Toolbar key="toolbar" shown={options.isToolshown} left={left} right={right} />
            <S.FrameWrap key="frame" offset={toolbarHeight}>
              {panels.map(({ id, key, render, match }) => (
                <Fragment key={id || key}>
                  {render({ active: match({ storyId, viewMode, location, path }) })}
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
};
Preview.defaultProps = {
  viewMode: undefined,
  storyId: undefined,
  path: undefined,
  description: undefined,
};

export { Preview };
