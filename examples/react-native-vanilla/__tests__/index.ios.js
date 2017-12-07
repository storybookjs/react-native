// This is the default file as put down by RN
/* eslint-disable */

import 'react-native';
import React from 'react';
import Index from '../index.ios.js';

jest.mock('global', () => ({
  ...global,
  WebSocket: function WebSocket(){},
}));

jest.mock("Dimensions", () => ({
  get: jest.fn().mockReturnValue({ width: 600, height:1800 }),
  addEventListener: jest.fn(),
}))

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer.create(<Index />);
});
