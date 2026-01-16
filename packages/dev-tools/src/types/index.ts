export interface StoryEntry {
  id: string;
  title: string;
  name: string;
  importPath: string;
  type: 'story' | 'docs';
  tags?: string[];
}

export interface StoryIndex {
  v: number;
  entries: Record<string, StoryEntry>;
}

export type TreeNodeType = 'group' | 'component' | 'story';

export interface TreeNode {
  id: string;
  name: string;
  type: TreeNodeType;
  depth: number;
  children: TreeNode[];
  storyId?: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
