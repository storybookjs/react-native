import { config } from '../configureActions';
import { configureActions } from '../..';

describe('Configure Actions', () => {
  it('can configure actions', () => {
    const depth = 100;
    const clearOnStoryChange = false;
    const limit = 20;

    configureActions({
      depth,
      clearOnStoryChange,
      limit,
    });

    expect(config).toEqual({
      depth,
      clearOnStoryChange,
      limit,
    });
  });
});
