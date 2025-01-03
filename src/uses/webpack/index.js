const { mkdirSync, editPkgJson } = require("../../helper/file");
const { editCacheConfig } = require("../../helper/util");

const paths = require("../../helper/paths");
const fs = require("fs-extra");

const relatedPackageMap = {
  dev: {
    webpack: "webpack",
    cli: "webpack-cli",
    server: "webpack-dev-server",
    htmlPlugin: "html-webpack-plugin",
    cleanPlugin: "clean-webpack-plugin",
  },
};

function useWebpack(commandConfig) {
  const templatePath = "template";
  fs.copySync(
    paths.resolvePath(templatePath, { dir: __dirname }),
    paths.appPath,
    {
      dereference: true,
      overwrite: false,
    }
  );

  editPkgJson((json) => {
    const scripts = {
      ...json.scripts,
    };
    scripts[scripts.dev ? "dev:webpack" : "dev"] =
      "webpack serve --config config/webpack.config.js --mode=development";

    scripts[scripts.build ? "build:webpack" : "build"] =
      "webpack --config config/webpack.config.js --mode=production";
    return {
      ...json,
      scripts,
    };
  });

  editCacheConfig((c) => {
    if (!c.buildPlatform) c.buildPlatform = [];

    return {
      ...c,
      buildPlatform: [...new Set([...c.buildPlatform, "webpack"])],
    };
  });

  return relatedPackageMap;
}

module.exports = useWebpack;
