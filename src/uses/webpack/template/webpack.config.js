const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const fpdUtils = require("fpd-utils");

module.exports = () => {
  const nameFormat = `[name]${fpdUtils.IS_PROD ? ".[contenthash:8]" : ""}`;

  const config = {
    mode: fpdUtils.IS_PROD ? "production" : "development",
    entry: {
      index: fpdUtils.resolvePath("src/index"),
    },
    output: {
      path: fpdUtils.resolvePath("dist"),
      filename: `js/${nameFormat}.bundle.js`,
      chunkFilename: `js/${nameFormat}.chunk.js`,
      assetModuleFilename: "assets/[hash][ext][query]",
      clean: true,
    },
    plugins: [new HtmlWebpackPlugin()],
  };

  if (fpdUtils.IS_DEV) {
    Object.assign(config, {
      cache: { type: "memory" },
      devtool: "eval-cheap-module-source-map",
      stats: "errors-only",
      devServer: {
        compress: true,
        host: "0.0.0.0",
        hot: true,
      },
    });
  }

  if (fpdUtils.IS_PROD) {
    config.plugins.push(new CleanWebpackPlugin());
  }
  return config;
};
