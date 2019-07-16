import { render, fireEvent } from 'react-testing-library';
import { withText } from './button.stories';

const mockAction = jest.fn();
jest.mock('@storybook/addon-actions', () => ({
  action: () => mockAction,
}));

describe('button interactivity', () => {
  it('should handle clicks', () => {
    const comp = render(withText());
    fireEvent.click(comp.getByText('Hello Button'));
    expect(mockAction).toHaveBeenCalled();
  });
});
