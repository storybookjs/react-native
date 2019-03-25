import merge from './lib/merge';

import { State } from './index';

interface Addition {
  [key: string]: any;
}
type Additions = Addition[];

// Returns the initialState of the app
const main = (...additions: Additions): State =>
  additions.reduce((acc: State, item) => merge(acc, item), {});

export default main;
