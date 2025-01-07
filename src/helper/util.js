const exec = require("exec-sh");
const {
  editFile,
  getFpdCacheConfig,
  resolvePath,
  editFpdCacheConfig,
} = require("fpd-utils");
const fs = require("fs-extra");

function execPromise(sh) {
  if (Array.isArray(sh)) sh = sh.join(" ");
  return exec.promise(sh);
}

const gitignoreContent = `node_modules\n.DS_Store\n*.log\n.cache\n.history`;

function getCommandConfig(program) {
  return {
    ...getFpdCacheConfig(),
    ...program.opts(),
  };
}

const mergeRelatedPackageMap = (source, target) => {
  ["dev", "prod"].forEach((env) => {
    if (source[env]) target[env] = { ...target[env], ...source[env] };
  });
};

const addPackage = async (program, relatedPackageMap) => {
  const commandConfig = getCommandConfig(program);
  const { packageManager, registry } = commandConfig;
  let empty = true;
  try {
    let shs = [packageManager, "add"];
    if (relatedPackageMap.prod) {
      const pkgs = Object.values(relatedPackageMap.prod);
      if (pkgs.length) {
        empty = false;
        shs = shs.concat(pkgs);
      }
    }
    if (relatedPackageMap.dev) {
      const devPkgs = Object.values(relatedPackageMap.dev);
      if (devPkgs.length) {
        empty = false;
        shs = shs.concat("-D", devPkgs);
      }
    }

    if (empty) return;

    if (registry) shs.push(`--registry=${registry}`);

    const gitignorePath = resolvePath(".gitignore");
    if (!fs.existsSync(gitignorePath)) {
      editFile(gitignorePath, gitignoreContent);
    }

    await execPromise(shs);
  } catch (error) {
    console.log("Error in addPackage", error);
  } finally {
    editFpdCacheConfig((c) => ({
      ...c,
      packageManager,
      registry,
    }));
  }
};

module.exports = {
  execPromise,
  getCommandConfig,
  mergeRelatedPackageMap,
  addPackage,
};
