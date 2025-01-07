const {
  getCommandConfig,
  addPackage,
  mergeRelatedPackageMap,
} = require("../helper/util");
const useWebpack = require("../uses/webpack");
const useVscode = require("../uses/vscode");
const useSwc = require("../uses/swc");
const ast = require("../helper/ast");

function init(program) {
  program
    .option(
      "-m, --package-manager <packageManager>",
      "Specifying a package management"
    )
    .option(
      "-p, --build-platform <buildPlatform>",
      "The platform that the project is used to build packaging"
    )
    .option("-c, --compiler <compiler>", "The project compiler")
    .option("-r, --registry <registry>", "The npm registry source")
    .option("-ts, --typescript", "Development with typescipt")
    .command("init")
    .description("Quickly initialize a project")
    .action(() => {
      const getConfig = () => getCommandConfig(program);
      const { buildPlatform, compiler } = getConfig();

      const relatedPackageMap = {};

      const payload = { getConfig, ast };

      switch (buildPlatform) {
        case "webpack":
          mergeRelatedPackageMap(useWebpack(payload), relatedPackageMap);
          break;
      }

      switch (compiler) {
        case "swc":
          mergeRelatedPackageMap(useSwc(payload), relatedPackageMap);
          break;
      }

      if (process.env.TERM_PROGRAM === "vscode") {
        useVscode(payload);
      }
      addPackage(program, relatedPackageMap);
    });
}

module.exports = init;
