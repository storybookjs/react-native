import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { colors } from './theme/colors';
import { DEFAULT_HOST, DEFAULT_PORT } from './constants';
import { useWebSocket, usePulseAnimation } from './hooks';
import { buildTree, filterTree, getAllNodeIds, countStories, countGroups } from './utils/tree';
import {
  Header,
  ConnectionPanel,
  SearchBar,
  StoriesHeader,
  StoryTree,
  EmptyState,
  LoadingState,
} from './components';
import type { TreeNode } from './types';

export default function StorybookDevToolsPanel() {
  // Connection state
  const [host, setHost] = useState(DEFAULT_HOST);
  const [port, setPort] = useState(String(DEFAULT_PORT));
  const [connectionExpanded, setConnectionExpanded] = useState(true);

  // Tree state
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // WebSocket connection
  const { status, storyIndex, selectedStoryId, errorMessage, connect, disconnect, selectStory } =
    useWebSocket(host, port);

  // Animations
  const pulseAnim = usePulseAnimation(status === 'connected');

  // Build and filter tree from story index
  const tree = useMemo(() => {
    if (!storyIndex?.entries) return [];
    return buildTree(Object.values(storyIndex.entries));
  }, [storyIndex]);

  const filteredTree = useMemo(() => filterTree(tree, searchQuery), [tree, searchQuery]);

  // Story counts
  const storyCount = useMemo(() => countStories(filteredTree), [filteredTree]);
  const groupCount = useMemo(() => countGroups(filteredTree), [filteredTree]);

  // Status color
  const statusColor =
    status === 'connected'
      ? colors.positive
      : status === 'connecting'
        ? colors.warning
        : status === 'error'
          ? colors.negative
          : colors.textMutedColor;

  // Handlers
  const handleToggleNode = useCallback((node: TreeNode) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  }, []);

  const handleExpandAll = useCallback(() => {
    setExpandedIds(new Set(getAllNodeIds(filteredTree)));
  }, [filteredTree]);

  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const handleConnect = useCallback(() => {
    connect();
    setConnectionExpanded(false);
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setConnectionExpanded(true);
  }, [disconnect]);

  // Render tree content based on state
  const renderContent = () => {
    if (status !== 'connected') {
      return <EmptyState message="Connect to view stories" />;
    }

    if (!storyIndex) {
      return <LoadingState />;
    }

    if (filteredTree.length === 0) {
      return (
        <EmptyState message={searchQuery ? 'No stories found' : 'No stories available'} showIcon />
      );
    }

    return (
      <StoryTree
        nodes={filteredTree}
        expandedIds={expandedIds}
        selectedStoryId={selectedStoryId}
        onToggle={handleToggleNode}
        onSelect={selectStory}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header statusColor={statusColor} pulseAnim={pulseAnim} />

      <ConnectionPanel
        host={host}
        port={port}
        status={status}
        statusColor={statusColor}
        pulseAnim={pulseAnim}
        isExpanded={connectionExpanded}
        errorMessage={errorMessage}
        onHostChange={setHost}
        onPortChange={setPort}
        onToggleExpanded={() => setConnectionExpanded(!connectionExpanded)}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <View style={styles.storiesSection}>
        <StoriesHeader
          storyCount={storyCount}
          groupCount={groupCount}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <ScrollView style={styles.treeScrollView} contentContainerStyle={styles.treeScrollContent}>
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBg,
  },
  storiesSection: {
    flex: 1,
    flexDirection: 'column',
  },
  treeScrollView: {
    flex: 1,
  },
  treeScrollContent: {
    paddingVertical: 4,
  },
});
