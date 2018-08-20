import React from 'react';

import Root from './containers/root';

import Nav from './containers/nav';
import Preview from './containers/preview';
import Panel from './containers/panel';

const App = () => <Root Preview={Preview} Nav={Nav} Panel={Panel} />;

export default App;
