const path = require("path");
const fs = require("fs-extra");

const appDirectory = fs.realpathSync(process.cwd());
const moduleFileExtensions = ["js", "jsx", "ts", "tsx", "json", "mjs", "cjs"];

const resolvePath = (
  relativePath = "",
  { dir = appDirectory, autoFindExt = false } = {}
) => {
  const filePath = path.resolve(dir, relativePath);
  if (!autoFindExt) return filePath;

  const extension =
    moduleFileExtensions.find((extension) =>
      fs.existsSync(`${filePath}.${extension}`)
    ) || "js";
  return `${filePath}.${extension}`;
};

module.exports = {
  appPath: resolvePath("."),
  appPublic: resolvePath("public"),
  appPkgJson: resolvePath("package.json"),
  appSrc: resolvePath("src"),
  appConfig: resolvePath("config"),
  fpdConfigJson: resolvePath("config/fpd.config.json"),
  resolvePath,
};
