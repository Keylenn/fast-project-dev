const { mergeRelatedPackageMap } = require("../../helper/util");
const fpdUtils = require("fpd-utils");
const fs = require("fs-extra");

function useSwc(paylaod) {
  const { getConfig, ast } = paylaod;
  const { buildPlatform } = getConfig();

  const relatedPackageMap = {};

  switch (buildPlatform) {
    case "webpack":
      ast("webpack.config", ({ getModuleProperty, pc, ts, getProperty }) => {
        const module = getModuleProperty("module", {
          defaultValue: "{}",
        });

        let rules = getProperty(module, "rules", {
          defaultValue: "[]",
          kind: ts.SyntaxKind.ArrayLiteralExpression,
        });

        if (rules.getText()?.includes("swc-loader")) {
          console.log(
            pc.yellow(
              `The configuration of ${pc.italic(
                pc.blueBright("swc-loader")
              )} already exists.`
            )
          );

          return;
        }

        rules.addElement(`{
            test: /.js$/,
            exclude: /node_modules/,
            use: {
              loader: "swc-loader",
            },
          },`);
        rules.formatText();
      });
      mergeRelatedPackageMap(
        {
          dev: {
            core: "@swc/core",
            loader: " swc-loader",
          },
        },
        relatedPackageMap
      );

      //  新建.swcrc 文件
      fs.copySync(
        fpdUtils.resolvePath("template", { dir: __dirname }),
        fpdUtils.appPath,
        {
          dereference: true,
          overwrite: false,
        }
      );
      break;
  }
  return relatedPackageMap;
}

module.exports = useSwc;
