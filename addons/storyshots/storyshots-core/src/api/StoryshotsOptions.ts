import { IOptions } from 'glob';
import { Stories2SnapsConverter } from '../Stories2SnapsConverter';
import { SupportedFramework } from '../frameworks';
import { RenderTree } from '../frameworks/Loader';

export interface StoryshotsOptions {
  asyncJest?: boolean;
  config?: (options: any) => void;
  integrityOptions?: IOptions | false;
  configPath?: string;
  suite?: string;
  storyKindRegex?: RegExp | string;
  storyNameRegex?: RegExp | string;
  framework?: SupportedFramework;
  test?: (story: any, context: any, renderTree: RenderTree, options?: any) => any;
  renderer?: Function;
  snapshotSerializers?: jest.SnapshotSerializerPlugin[];
  /**
   * @Deprecated The functionality of this option is completely covered by snapshotSerializers which should be used instead.
   */
  serializer?: any;
  stories2snapsConverter?: Stories2SnapsConverter;
}
