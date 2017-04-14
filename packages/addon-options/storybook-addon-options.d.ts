interface Options {
  name?: string;
  url?: string;
  goFullScreen?: boolean;
  showLeftPanel?: boolean;
  showDownPanel?: boolean;
  showSearchBox?: boolean;
  downPanelInRight?: boolean;
  sortStoriesByKind?: boolean;
}

export function setOptions(options: Options): void;
