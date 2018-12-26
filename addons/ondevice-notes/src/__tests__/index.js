import addons from '@storybook/addons';
import { withNotes } from '..';

addons.getChannel = jest.fn();

describe('Storybook Addon Notes', () => {
  it('should inject text from `notes` parameter', () => {
    const channel = { emit: jest.fn() };
    addons.getChannel.mockReturnValue(channel);

    const getStory = jest.fn();
    const context = { parameters: { notes: 'hello' } };

    withNotes(getStory, context);
    expect(channel.emit).toHaveBeenCalledWith('storybook/notes/add_notes', 'hello');
    expect(getStory).toHaveBeenCalledWith(context);
  });

  it('should inject text even if no `notes` parameter is set to reset the addon', () => {
    const channel = { emit: jest.fn() };
    addons.getChannel.mockReturnValue(channel);

    const getStory = jest.fn();
    const context = {};

    withNotes(getStory, context);
    expect(channel.emit).toHaveBeenCalled();
    expect(getStory).toHaveBeenCalledWith(context);
  });

  it('should inject markdown from `notes.markdown` parameter', () => {
    const channel = { emit: jest.fn() };
    addons.getChannel.mockReturnValue(channel);

    const getStory = jest.fn();
    const context = { parameters: { notes: { markdown: '# hello' } } };

    withNotes(getStory, context);
    expect(channel.emit).toHaveBeenCalledWith('storybook/notes/add_notes', '# hello');
    expect(getStory).toHaveBeenCalledWith(context);
  });
});
