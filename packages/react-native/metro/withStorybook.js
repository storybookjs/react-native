var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// scripts/common.js
var require_common = __commonJS({
  "scripts/common.js"(exports2, module2) {
    var { globToRegexp, serverRequire } = require("@storybook/core/common");
    var path2 = require("path");
    var fs = require("fs");
    var cwd = process.cwd();
    var toRequireContext = (specifier) => {
      const { directory, files } = specifier;
      const match = globToRegexp(`./${files}`);
      return {
        path: directory,
        recursive: files.includes("**") || files.split("/").length > 1,
        match
      };
    };
    function requireUncached(module3) {
      delete require.cache[require.resolve(module3)];
      return serverRequire(module3);
    }
    var supportedExtensions = ["js", "jsx", "ts", "tsx", "cjs", "mjs"];
    function getFilePathExtension({ configPath }, fileName) {
      for (const ext of supportedExtensions) {
        const filePath = path2.resolve(cwd, configPath, `${fileName}.${ext}`);
        if (fs.existsSync(filePath)) {
          return ext;
        }
      }
      return null;
    }
    function getMain({ configPath }) {
      const fileExtension = getFilePathExtension({ configPath }, "main");
      if (fileExtension === null) {
        throw new Error("main config file not found");
      }
      const mainPath = path2.resolve(cwd, configPath, `main.${fileExtension}`);
      return requireUncached(mainPath);
    }
    function ensureRelativePathHasDot(relativePath) {
      return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
    }
    function getPreviewExists({ configPath }) {
      return !!getFilePathExtension({ configPath }, "preview");
    }
    module2.exports = {
      toRequireContext,
      requireUncached,
      getFilePathExtension,
      getMain,
      ensureRelativePathHasDot,
      getPreviewExists
    };
  }
});

// scripts/generate.js
var require_generate = __commonJS({
  "scripts/generate.js"(exports2, module2) {
    var {
      toRequireContext,
      ensureRelativePathHasDot,
      getMain,
      getPreviewExists
    } = require_common();
    var { normalizeStories, globToRegexp } = require("@storybook/core/common");
    var fs = require("fs");
    var prettier = require("prettier");
    var path2 = require("path");
    var cwd = process.cwd();
    function generate2({ configPath, absolute = false, useJs = false }) {
      const storybookRequiresLocation = path2.resolve(
        cwd,
        configPath,
        `storybook.requires.${useJs ? "js" : "ts"}`
      );
      const mainImport = getMain({ configPath });
      const main = mainImport.default ?? mainImport;
      const storiesSpecifiers = normalizeStories(main.stories, {
        configDir: configPath,
        workingDir: cwd
      });
      const normalizedStories = storiesSpecifiers.map((specifier) => {
        const reg = globToRegexp(`./${specifier.files}`);
        const { path: p, recursive: r, match: m } = toRequireContext(specifier);
        const pathToStory = ensureRelativePathHasDot(path2.posix.relative(configPath, p));
        return `{
      titlePrefix: "${specifier.titlePrefix}",
      directory: "${specifier.directory}",
      files: "${specifier.files}",
      importPathMatcher: /${reg.source}/,
      ${useJs ? "" : "// @ts-ignore"}
      req: require.context('${pathToStory}', ${r}, ${m})
    }`;
      });
      const registerAddons = main.addons?.map((addon) => `import "${addon}/register";`).join("\n");
      const doctools = 'require("@storybook/react-native/dist/preview")';
      const enhancer = main.addons?.includes("@storybook/addon-ondevice-actions") ? "require('@storybook/addon-actions/preview')" : "";
      let options = "";
      let optionsVar = "";
      const reactNativeOptions = main.reactNative;
      if (reactNativeOptions && typeof reactNativeOptions === "object") {
        optionsVar = `const options = ${JSON.stringify(reactNativeOptions)}`;
        options = "options";
      }
      const previewExists = getPreviewExists({ configPath });
      const annotations = `[${previewExists ? "require('./preview')," : ""}${doctools}, ${enhancer}]`;
      const globalTypes = `
    declare global {
      var view: ReturnType<typeof start>;
      var STORIES: typeof normalizedStories;
    }
  `;
      const fileContent = `
  /* do not change this file, it is auto generated by storybook. */

  import { start, updateView } from '@storybook/react-native';

  ${registerAddons}

  const normalizedStories = [${normalizedStories.join(",")}];

  ${useJs ? "" : globalTypes}

  const annotations = ${annotations};

  global.STORIES = normalizedStories;
  
  ${useJs ? "" : "// @ts-ignore"}
  module?.hot?.accept?.();

  ${optionsVar}

  if (!global.view) {
    global.view = start({
      annotations,
      storyEntries: normalizedStories,
      ${options}
    });
  } else {
    updateView(global.view, annotations, normalizedStories, ${options});
  }

  export const view = global.view;
`;
      const formattedFileContent = prettier.format(fileContent, { parser: "babel-ts" });
      fs.writeFileSync(storybookRequiresLocation, formattedFileContent, {
        encoding: "utf8",
        flag: "w"
      });
    }
    module2.exports = {
      generate: generate2
    };
  }
});

// metro/withStorybook.ts
var path = __toESM(require("path"));
var import_generate = __toESM(require_generate());
var import_ws = require("ws");
function withStorybook(config, options = {
  enabled: true,
  useJs: false,
  onDisabledRemoveStorybook: false
}) {
  const {
    configPath,
    enabled = true,
    websockets,
    useJs = false,
    onDisabledRemoveStorybook = false
  } = options;
  if (!enabled) {
    if (onDisabledRemoveStorybook) {
      return {
        ...config,
        resolver: {
          ...config.resolver,
          resolveRequest: (context, moduleName, platform) => {
            const resolveFunction = config?.resolver?.resolveRequest ? config.resolver.resolveRequest : context.resolveRequest;
            if (moduleName.startsWith("storybook") || moduleName.startsWith("@storybook")) {
              return {
                type: "empty"
              };
            }
            return resolveFunction(context, moduleName, platform);
          }
        }
      };
    }
    return config;
  }
  if (websockets) {
    const port = websockets.port ?? 7007;
    const host = websockets.host ?? "localhost";
    const wss = new import_ws.WebSocketServer({ port, host });
    wss.on("connection", function connection(ws) {
      console.log("WebSocket connection established");
      ws.on("error", console.error);
      ws.on("message", function message(data) {
        try {
          const json = JSON.parse(data.toString());
          wss.clients.forEach((wsClient) => wsClient.send(JSON.stringify(json)));
        } catch (error) {
          console.error(error);
        }
      });
    });
  }
  (0, import_generate.generate)({
    configPath: configPath ?? path.resolve(process.cwd(), "./.storybook"),
    useJs
  });
  return {
    ...config,
    transformer: {
      ...config.transformer,
      unstable_allowRequireContext: true
    },
    resolver: {
      ...config.resolver,
      resolveRequest: (context, moduleName, platform) => {
        const resolveFunction = config?.resolver?.resolveRequest ? config.resolver.resolveRequest : context.resolveRequest;
        const isStorybookModule = moduleName.startsWith("storybook") || moduleName.startsWith("@storybook");
        const theContext = isStorybookModule ? {
          ...context,
          unstable_enablePackageExports: true,
          unstable_conditionNames: ["import"]
        } : context;
        const resolveResult = resolveFunction(theContext, moduleName, platform);
        if (resolveResult?.filePath?.includes?.("@storybook/react/template/cli")) {
          return {
            type: "empty"
          };
        }
        return resolveResult;
      }
    }
  };
}
module.exports = withStorybook;
