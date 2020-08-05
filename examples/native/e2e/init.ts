import detox from 'detox';
import adapter from 'detox/runners/jest/adapter';
import specReporter from 'detox/runners/jest/specReporter';
// @ts-ignore
import { detox as config } from '../package.json';

// Set the default timeout
jest.setTimeout(120000);

(jasmine as any).getEnv().addReporter(adapter);
// This takes care of generating status logs on a per-spec basis. By default, jest only reports at file-level.
// This is strictly optional.
(jasmine as any).getEnv().addReporter(specReporter);

beforeAll(async () => {
  await detox.init(config);
}, 300000);

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});
