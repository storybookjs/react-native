export function storyFilter(stories, filter, selectedKind) {
  if (!stories) return null;
  if (!filter) return stories;

  return stories.filter((kindInfo) => {
    if (kindInfo.kind === selectedKind) return true;
    return kindInfo.kind.toLocaleLowerCase().indexOf(filter) >= 0;
  });
}
