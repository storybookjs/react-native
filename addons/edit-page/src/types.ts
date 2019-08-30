export interface IFileInfo {
  id?: string;
  kind?: string;
  name?: string;
  displayName?: string;
  fileName?: string;
  shortName?: string;
}

export type fileNameResolveType = (info: IFileInfo) => string;

interface EditPageProps {
  filePath?: string;
  shortName?: string;
  parameters?: any;
}

export interface EditStoriesProps {
  fileNameResolve?: fileNameResolveType;
  editPageLabel?: string;
  render?: (config: EditPageProps) => JSX.Element;
}
