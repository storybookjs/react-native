import type { StoryEntry, TreeNode } from '../types';

/**
 * Builds a hierarchical tree structure from flat story entries
 */
export function buildTree(entries: StoryEntry[]): TreeNode[] {
  const root: TreeNode[] = [];
  const nodeMap = new Map<string, TreeNode>();

  const sortedEntries = [...entries].sort((a, b) =>
    `${a.title}/${a.name}`.localeCompare(`${b.title}/${b.name}`)
  );

  for (const entry of sortedEntries) {
    if (entry.type !== 'story') continue;

    const pathParts = entry.title.split('/');
    let currentPath = '';
    let currentLevel = root;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLastSegment = i === pathParts.length - 1;

      let node = nodeMap.get(currentPath);

      if (!node) {
        node = {
          id: currentPath,
          name: part,
          type: isLastSegment ? 'component' : 'group',
          depth: i,
          children: [],
        };
        nodeMap.set(currentPath, node);
        currentLevel.push(node);
      }

      currentLevel = node.children;
    }

    currentLevel.push({
      id: entry.id,
      name: entry.name,
      type: 'story',
      depth: pathParts.length,
      children: [],
      storyId: entry.id,
    });
  }

  return root;
}

/**
 * Filters tree nodes based on search query
 * When a parent matches, all its children are preserved for browsing
 */
export function filterTree(nodes: TreeNode[], query: string): TreeNode[] {
  if (!query.trim()) return nodes;

  const lowerQuery = query.toLowerCase();

  function filterNode(node: TreeNode): TreeNode | null {
    const nameMatches = node.name.toLowerCase().includes(lowerQuery);
    const filteredChildren = node.children.map(filterNode).filter((n): n is TreeNode => n !== null);

    if (nameMatches) {
      return { ...node, children: node.children };
    }

    if (filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }

    return null;
  }

  return nodes.map(filterNode).filter((n): n is TreeNode => n !== null);
}

/**
 * Gets all expandable node IDs (groups and components)
 */
export function getAllNodeIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];
  function collect(node: TreeNode) {
    if (node.type !== 'story') ids.push(node.id);
    node.children.forEach(collect);
  }
  nodes.forEach(collect);
  return ids;
}

/**
 * Counts total stories in tree
 */
export function countStories(nodes: TreeNode[]): number {
  let count = 0;
  function countNode(node: TreeNode) {
    if (node.type === 'story') count++;
    node.children.forEach(countNode);
  }
  nodes.forEach(countNode);
  return count;
}

/**
 * Counts total groups/components in tree
 */
export function countGroups(nodes: TreeNode[]): number {
  let count = 0;
  function countNode(node: TreeNode) {
    if (node.type !== 'story') count++;
    node.children.forEach(countNode);
  }
  nodes.forEach(countNode);
  return count;
}
