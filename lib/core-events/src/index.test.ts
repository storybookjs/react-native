import * as EventsPackageExport from '.';
import EventsDefaultExport from '.';
import { CHANNEL_CREATED } from '.';

describe('Core Events', () => {
  it('Should export the module as a namespace', () => {
    expect(EventsPackageExport.CHANNEL_CREATED).toBe('channelCreated');
  });
  it('Should export all values in the default export', () => {
    expect(EventsDefaultExport.CHANNEL_CREATED).toBe('channelCreated');
  });
  it('Should export values as named exports', () => {
    expect(CHANNEL_CREATED).toBe('channelCreated');
  });
});
