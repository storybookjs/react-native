// Type definitions for Metro bundler runtime APIs.
//
// Based on Expo's approach: https://github.com/expo/expo/blob/main/packages/expo/types/metro-require.d.ts
// Which is derived from: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/webpack-env/index.d.ts
//
// Metro's require.context API intentionally matches webpack's API by design.
// See: https://github.com/facebook/metro/pull/822
//
// HMR types based on Metro's Flow definitions:
// See: https://github.com/facebook/metro/blob/main/packages/metro-runtime/src/polyfills/require.js.flow

declare namespace __MetroModuleApi {
  interface RequireContext {
    /** Return the keys that can be resolved. */
    keys(): string[];
    (id: string): any;
    <T>(id: string): T;
    /** **Unimplemented:** Return the module identifier for a user request. */
    resolve(id: string): string;
    /** **Unimplemented:** Readable identifier for the context module. */
    id: string;
  }

  interface RequireFunction {
    /**
     * Returns the exports from a dependency. The call is sync. No request to the server is fired.
     * The compiler ensures that the dependency is available.
     */
    (path: string): any;
    <T>(path: string): T;

    /**
     * Import all modules from a directory dynamically. This module dynamically updates
     * when the files in a directory are added or removed.
     *
     * **Enabling:** This feature can be enabled by setting the `transformer.unstable_allowRequireContext`
     * property to `true` in your Metro configuration.
     *
     * @param path File path pointing to the directory to require.
     * @param recursive Should search for files recursively. Optional, default `true`.
     * @param filter Filename filter pattern. Optional, default `.*` (any file).
     * @param mode Mode for resolving dynamic dependencies. Defaults to `sync`.
     */
    context(
      path: string,
      recursive?: boolean,
      filter?: RegExp,
      mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once'
    ): RequireContext;
  }

  interface Hot {
    /** Accept updates for this module. */
    accept(callback?: () => void): void;
    /** Register a dispose handler for cleanup before module replacement. */
    dispose(callback?: () => void): void;
  }
}

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Intentional declaration merging to extend NodeJS.Require
  interface Require extends __MetroModuleApi.RequireFunction {}
  interface Module {
    hot?: __MetroModuleApi.Hot;
  }
}

// eslint-disable-next-line no-var -- ambient global declaration must merge with Node's `var module`
declare var module: NodeJS.Module;
