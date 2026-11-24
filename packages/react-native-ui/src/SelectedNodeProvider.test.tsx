import { render } from '@testing-library/react-native';
import { memo } from 'react';
import { Text } from 'react-native';
import { SelectedNodeProvider, useSelectedNode } from './SelectedNodeProvider';

describe('SelectedNodeProvider', () => {
  it('does not re-render memoised consumers when its parent re-renders', async () => {
    const onRender = jest.fn();

    // Stands in for a sidebar tree node: memoised, and reading the context for `setNodeRef`.
    const Consumer = memo(function Consumer() {
      useSelectedNode();
      onRender();
      return <Text>node</Text>;
    });

    // Layout renders the provider and re-renders on every story switch.
    const Parent = ({ story }: { story: string }) => (
      <SelectedNodeProvider>
        <Text>{story}</Text>
        <Consumer />
      </SelectedNodeProvider>
    );

    const { rerender } = await render(<Parent story="a" />);
    expect(onRender).toHaveBeenCalledTimes(1);

    await rerender(<Parent story="b" />);
    await rerender(<Parent story="c" />);

    expect(onRender).toHaveBeenCalledTimes(1);
  });

  it('keeps the same context value between renders', async () => {
    const values: ReturnType<typeof useSelectedNode>[] = [];

    const Consumer = () => {
      values.push(useSelectedNode());
      return null;
    };

    const { rerender } = await render(
      <SelectedNodeProvider>
        <Consumer />
      </SelectedNodeProvider>
    );
    await rerender(
      <SelectedNodeProvider>
        <Consumer />
      </SelectedNodeProvider>
    );

    expect(values).toHaveLength(2);
    expect(values[1]).toBe(values[0]);
  });
});
