const exec = require("exec-sh");
const { readJSON, editJSON } = require("./file");
const path = require("path");

function execPromise(sh) {
  if (Array.isArray(sh)) sh = sh.join(" ");
  console.log(sh);
  return exec.promise(sh);
}

function baseCommandOptions(program) {
  return program
    .option("-f, --frame", "The framework that the project depends on")
    .option(
      "-p, --platform",
      "The platform that the project is used to build packaging"
    )
    .option(
      "-m, --package-manager <packageManager>",
      "Specifying a package management"
    );
}

const FPD_CONFING_FILE_PARH = path.join(process.cwd(), "fpd.config.json");

function readCacheConfig() {
  return readJSON(FPD_CONFING_FILE_PARH, {
    createWhenNotExist: true,
    initialContent: {
      packageManager: "npm",
    },
    hidden: true,
  });
}

function editCacheConfig(contentOrCallback) {
  return editJSON(FPD_CONFING_FILE_PARH, contentOrCallback);
}

module.exports = {
  execPromise,
  baseCommandOptions,
  readCacheConfig,
  editCacheConfig,
};
