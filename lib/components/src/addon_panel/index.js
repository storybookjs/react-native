import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import { baseFonts, Placeholder } from '../';

const Wrapper = glamorous.div({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  borderRadius: 4,
  border: 'solid 1px rgb(236, 236, 236)',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
});

export const TabBar = glamorous.div({
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
  height: '100%',
  width: '100%',
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
  ({ hidden }) => (hidden ? { display: 'none' } : { display: 'flex', flex: 1 })
);

export const Tab = ({ selected, name, title, onSelect }) => {
  const onClick = e => {
    e.preventDefault();
    onSelect(name);
  };

  return (
    <TabButton type="button" key={name} selected={selected} onClick={onClick} role="tab">
      {typeof title === 'function' ? title() : title}
    </TabButton>
  );
};

Tab.propTypes = {
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  onSelect: PropTypes.func.isRequired,
};

const AddonPanel = ({ panels, selectedPanel, onPanelSelect }) => {
  const hasPanels = panels && Object.keys(panels).length;

  return hasPanels ? (
    <Wrapper>
      <TabBar role="tablist">
        {Object.entries(panels).map(([name, data]) => (
          <Tab
            key={name}
            selected={name === selectedPanel}
            name={name}
            title={data.title}
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
    <Placeholder>no panels available</Placeholder>
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
