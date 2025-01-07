const {
  editPkgJson,
  resolvePath,
  appPath,
  editFpdCacheConfig,
} = require("fpd-utils");
const fs = require("fs-extra");

const relatedPackageMap = {
  dev: {
    webpack: "webpack",
    cli: "webpack-cli",
    server: "webpack-dev-server",
    htmlPlugin: "html-webpack-plugin",
    cleanPlugin: "clean-webpack-plugin",
    env: "cross-env",
    utils: "fpd-utils",
  },
};

function useWebpack() {
  fs.copySync(resolvePath("template", { dir: __dirname }), appPath, {
    dereference: true,
    overwrite: false,
  });

  editPkgJson((json) => {
    const scripts = {
      ...json.scripts,
    };
    scripts[scripts.dev ? "dev:webpack" : "dev"] =
      "cross-env NODE_ENV=dev webpack serve";

    scripts[scripts.build ? "build:webpack" : "build"] =
      "cross-env NODE_ENV=prod webpack";
    return {
      ...json,
      scripts,
    };
  });

  editFpdCacheConfig((c) => {
    if (!c.buildPlatform) c.buildPlatform = [];

    return {
      ...c,
      buildPlatform: [...new Set([...c.buildPlatform, "webpack"])],
    };
  });

  return relatedPackageMap;
}

module.exports = useWebpack;
