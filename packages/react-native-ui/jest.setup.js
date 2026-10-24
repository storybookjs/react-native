// React only allows `act()` when the environment opts in, and a bare node test environment
// does not do it.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
