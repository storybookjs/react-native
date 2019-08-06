import { IOptions } from 'glob';
import Stories2SnapsConverter from '../Stories2SnapsConverter';
import { SupportedFramework } from '../frameworks';

export interface StoryshotsOptions {
  asyncJest?: boolean;
  config?: (options: any) => void;
  integrityOptions?: IOptions;
  configPath?: string;
  suite?: string;
  storyKindRegex?: RegExp | string;
  storyNameRegex?: RegExp | string;
  framework?: SupportedFramework;
  test?: Function;
  renderer?: Function;
  snapshotSerializers?: any[];
  /**
   * @Deprecated The functionality of this option is completely covered by snapshotSerializers which should be used instead.
   */
  serializer?: any;
  stories2snapsConverter?: Stories2SnapsConverter;
}
