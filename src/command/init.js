const {
  baseCommandOptions,
  getCommandConfig,
  addPackage,
  mergeRelatedPackageMap,
} = require("../helper/util");
const { ensurePkgJson } = require("../helper/file");
const useWebpack = require("../uses/webpack");
const useVscode = require("../uses/vscode");

function init(program) {
  baseCommandOptions(program)
    .command("init")
    .description("Quickly initialize a project")
    .action(() => {
      const commandConfig = getCommandConfig(program);
      const { buildPlatform } = commandConfig;

      ensurePkgJson();

      const relatedPackageMap = {};

      switch (buildPlatform) {
        case "webpack":
          mergeRelatedPackageMap(useWebpack(commandConfig), relatedPackageMap);
          break;
      }

      if (process.env.TERM_PROGRAM === "vscode") {
        useVscode();
      }
      addPackage(program, relatedPackageMap);
    });
}

module.exports = init;
