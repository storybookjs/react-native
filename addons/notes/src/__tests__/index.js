import addons from '@storybook/addons';
import { withNotes } from '..';

jest.mock('@storybook/addons');

describe('Storybook Addon Notes', () => {
  it('should inject info', () => {
    const channel = { emit: jest.fn() };
    addons.getChannel.mockReturnValue(channel);

    const getStory = jest.fn();
    const context = {};

    const decoratedStory = withNotes('hello')(getStory);
    decoratedStory(context);
    expect(channel.emit).toHaveBeenCalledWith('storybook/notes/add_notes', 'hello');
    expect(getStory).toHaveBeenCalledWith(context);
  });
});
