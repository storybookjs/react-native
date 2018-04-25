import { config } from '../configureActions';
import { configureActions } from '../../';

describe('Configure Actions', () => {
  it('can configure actions', () => {
    const depth = 100;
    const clearOnStoryChange = false;

    configureActions({
      depth,
      clearOnStoryChange,
    });

    expect(config).toEqual({
      depth,
      clearOnStoryChange,
    });
  });
});
