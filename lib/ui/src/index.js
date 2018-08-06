import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

import Provider from './provider';

function renderStorybokUI(domNode, provider) {
  if (!(provider instanceof Provider)) {
    throw new Error('provider is not extended from the base Provider');
  }

  ReactDOM.render(<App provider={provider} />, domNode);
}

export { Provider };
export default renderStorybokUI;
