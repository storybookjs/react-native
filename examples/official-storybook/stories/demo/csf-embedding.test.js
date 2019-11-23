import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { WithText, WithCounter } from './button.stories';

const mockAction = jest.fn();
jest.mock('@storybook/addon-actions', () => ({
  action: () => mockAction,
}));

describe('module story embedding', () => {
  it('should test actions', () => {
    const comp = render(<WithText />);
    fireEvent.click(comp.getByText('Hello Button'));
    expect(mockAction).toHaveBeenCalled();
  });

  it('should test story state', () => {
    const comp = render(<WithCounter />);
    fireEvent.click(comp.getByText('Testing: 0'));
    expect(comp.getByText('Testing: 1')).toBeTruthy();
  });
});
