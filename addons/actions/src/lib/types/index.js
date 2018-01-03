import objectType from './object';
import dateType from './date';
import functionType from './function';
import infinityType from './infinity';
import nanType from './nan';
import regexpType from './regexp';
import symbolType from './symbol';
import undefinedType from './undefined';

export { objectType };
export { dateType };
export { functionType };
export { infinityType };
export { nanType };
export { regexpType };
export { symbolType };
export { undefinedType };

export const types = [
  dateType,
  functionType,
  nanType,
  infinityType,
  regexpType,
  symbolType,
  undefinedType,
];
