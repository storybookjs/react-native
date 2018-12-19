import { Router } from '@storybook/components';

const legacyUrlSupport = ({ location, path }, navigate) => {
  const addition = {};
  const query = Router.parseQuery(location);

  if (query.full === '1') {
    addition.isFullscreen = true;
  }
  if (query.panel) {
    if (['right', 'bottom'].includes(query.panel)) {
      addition.panelPosition = query.panel;
    } else if (query.panel === '0') {
      addition.showPanel = false;
    }
  }
  if (query.nav === '0') {
    addition.showNav = false;
  }

  if (!query.path || query.path === '/') {
    setTimeout(() => navigate(`/components/*`, { replace: true }), 1);
  } else if (Object.keys(query).length > 1) {
    // remove other queries
    setTimeout(() => navigate(`/${query.path}`, { replace: true }), 1);
  }

  return { layout: addition, location, path };
};

export default function({ navigate, location, path: initialPath }) {
  const api = {
    navigate,
  };

  return { api, state: legacyUrlSupport({ location, path: initialPath }, navigate) };
}
