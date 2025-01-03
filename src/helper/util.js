const exec = require("exec-sh");
const { readJson, editJson, editFile } = require("./file");
const paths = require("./paths");
const fs = require("fs-extra");

function execPromise(sh) {
  if (Array.isArray(sh)) sh = sh.join(" ");
  return exec.promise(sh);
}

const gitignoreContent = `
node_modules
.DS_Store
*.log
.cache
.history`;

const baseCommandOptions = (program) =>
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
    .option("-ts, --typescript", "Development with typescipt");

const readCacheConfig = () =>
  readJson(paths.fpdConfigJson, {
    createWhenNotExist: true,
  });

function getCommandConfig(program) {
  const config = readCacheConfig();

  return {
    packageManager: "npm",
    registry: "https://registry.npmmirror.com/",
    ...config,
    ...program.opts(),
  };
}

const editCacheConfig = (contentOrCallback) =>
  editJson(paths.fpdConfigJson, contentOrCallback);

const mergeRelatedPackageMap = (source, target) => {
  ["dev", "prod"].forEach((env) => {
    if (source[env]) target[env] = { ...target[env], ...source[env] };
  });
};

const addPackage = async (program, relatedPackageMap) => {
  const commandConfig = getCommandConfig(program);
  const { packageManager, registry } = commandConfig;
  try {
    let shs = [packageManager, "add"];
    if (relatedPackageMap.prod) {
      shs = shs.concat(Object.values(relatedPackageMap.prod));
    }
    if (relatedPackageMap.dev) {
      shs = shs.concat("-D", Object.values(relatedPackageMap.dev));
    }

    if (registry) shs.push(`--registry=${registry}`);

    const gitignorePath = paths.resolvePath(".gitignore");
    if (!fs.existsSync(gitignorePath)) {
      editFile(gitignorePath, gitignoreContent);
    }

    await execPromise(shs);
  } catch (error) {
    console.log("Error in addPackage", error);
  } finally {
    editCacheConfig((c) => ({
      ...c,
      packageManager,
      registry,
    }));
  }
};

module.exports = {
  execPromise,
  baseCommandOptions,
  readCacheConfig,
  editCacheConfig,
  getCommandConfig,
  addPackage,
  mergeRelatedPackageMap,
};
