const fs = require("fs-extra");
const { dirname, basename } = require("path");
const paths = require("./paths");

function readFile(file, options = {}) {
  const { createWhenNotExist, initialContent = "" } = options;
  if (createWhenNotExist && fs.existsSync(file) === false) {
    const dirPath = dirname(file);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(file, initialContent);
  }
  return fs.readFileSync(file, "utf-8");
}

function editFile(file, contentOrCallback, options) {
  const content =
    typeof contentOrCallback === "function"
      ? contentOrCallback(readFile(file, options))
      : contentOrCallback;
  fs.writeFileSync(file, content, "utf-8");
}

function readJson(file, options = {}) {
  return JSON.parse(
    readFile(file, {
      ...options,
      initialContent: JSON.stringify(options?.initialContent ?? {}, null, 2),
    })
  );
}

function editJson(file, contentOrCallback, options) {
  const content =
    typeof contentOrCallback === "function"
      ? contentOrCallback(readJson(file, options))
      : contentOrCallback;
  fs.writeFileSync(file, JSON.stringify(content, null, 2), "utf-8");
}

const DEFAULT_PKG_JSON = {
  version: "0.1.0",
  description: "",
  scripts: {},
};

function editPkgJson(callabck, options) {
  return editJson(
    paths.appPkgJson,
    (json) => {
      const pkgJSON = {
        name: basename(paths.appPath),
        ...DEFAULT_PKG_JSON,
      };

      const newJSON = typeof callabck === "function" ? callabck(json) : json;

      return {
        ...pkgJSON,
        ...newJSON,
      };
    },
    {
      createWhenNotExist: true,
      ...options,
    }
  );
}

const ensurePkgJson = () => editPkgJson();

function mkdirSync(dir, options) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, options);
  }
}

module.exports = {
  readFile,
  editFile,
  readJson,
  editJson,
  editPkgJson,
  ensurePkgJson,
  mkdirSync,
};
