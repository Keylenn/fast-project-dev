const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  const isDevMode = argv.mode === "development";
  const isProdMode = argv.mode === "production";
  const nameFormat = `[name]${isDevMode ? "" : ".[contenthash:8]"}`;

  const config = {
    mode: isDevMode ? "development" : "production",
    entry: {
      index: path.resolve(__dirname, "../src/index"),
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
      filename: `js/${nameFormat}.bundle.js`,
      chunkFilename: `js/${nameFormat}.chunk.js`,
      assetModuleFilename: "assets/[hash][ext][query]",
      clean: true,
    },
    plugins: [new HtmlWebpackPlugin()],
  };

  if (isDevMode) {
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

  if (isProdMode) {
    config.plugins.push(new CleanWebpackPlugin());
  }

  return config;
};
