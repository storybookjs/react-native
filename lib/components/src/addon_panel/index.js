import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import { baseFonts } from '../';

const Empty = glamorous.div(baseFonts, {
  flex: 1,
  display: 'flex',
  fontSize: 11,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  alignItems: 'center',
  justifyContent: 'center',
});

const Wrapper = glamorous.div({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  borderRadius: 4,
  border: 'solid 1px rgb(236, 236, 236)',
  marginTop: 5,
  overflow: 'hidden',
  width: '100%',
});

const TabBar = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderBottom: 'solid 1px #eaeaea',
});

const Content = glamorous.div({
  flex: '1 1 0',
  display: 'flex',
  overflow: 'auto',
});

const TabButton = glamorous.div(
  baseFonts,
  {
    fontSize: 11,
    letterSpacing: '1px',
    padding: '10px 15px',
    textTransform: 'uppercase',
    transition: 'opacity 0.3s',
    maxHeight: 60,
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
  },
  ({ selected }) =>
    selected
      ? {
          opacity: 1,
        }
      : {
          opacity: 0.5,
        }
);

const Panel = glamorous.div(
  ({ hidden }) => (hidden ? { display: 'none' } : { flex: 1, display: 'flex' })
);

const Tab = ({ selected, name, panel, onSelect }) => {
  const onClick = e => {
    e.preventDefault();
    onSelect(name);
  };

  const title = typeof panel.title === 'function' ? panel.title() : panel.title;

  return (
    <TabButton type="button" key={name} selected={selected} onClick={onClick} role="tab">
      {title}
    </TabButton>
  );
};

Tab.propTypes = {
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  panel: PropTypes.shape({
    title: PropTypes.oneOf(PropTypes.func, PropTypes.string),
    render: PropTypes.node,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

const AddonPanel = ({ panels, selectedPanel, onPanelSelect }) => {
  const hasPanels = panels && Object.keys(panels).length;

  return hasPanels ? (
    <Wrapper>
      <TabBar role="tablist">
        {Object.entries(panels).map(([name, data]) => (
          <Tab
            selected={name === selectedPanel}
            name={name}
            panel={data}
            onSelect={onPanelSelect}
          />
        ))}
      </TabBar>
      <Content>
        {Object.keys(panels)
          .sort()
          .map(name => {
            const panel = panels[name];

            return (
              <Panel key={name} hidden={name !== selectedPanel} role="tabpanel">
                {panel.render()}
              </Panel>
            );
          })}
      </Content>
    </Wrapper>
  ) : (
    <Empty>no panels available</Empty>
  );
};

AddonPanel.defaultProps = {
  panels: {},
  onPanelSelect: () => {},
  selectedPanel: null,
};

AddonPanel.propTypes = {
  panels: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onPanelSelect: PropTypes.func,
  selectedPanel: PropTypes.string,
};

export default AddonPanel;
