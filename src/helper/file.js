const fs = require("fs");
const path = require("path");
const fswin = require("fswin");

function readFile(file, options = {}) {
  const { createWhenNotExist, initialContent = "", hidden } = options;
  try {
    if (createWhenNotExist) fs.accessSync(file, fs.constants.F_OK);
  } catch (error) {
    const dirPath = path.dirname(file);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(file, initialContent);

    if (hidden) {
      fswin.setAttributesSync(dirPath, { IS_HIDDEN: true });
    }
  } finally {
    return fs.readFileSync(file, "utf-8");
  }
}

function editFile(file, contentOrCallback, options) {
  const content =
    typeof contentOrCallback === "function"
      ? contentOrCallback(readFile(file, options))
      : contentOrCallback;
  fs.writeFileSync(file, callback(content), "utf-8");
}

function readJSON(file, options = {}) {
  return JSON.parse(
    readFile(file, {
      ...options,
      initialContent: JSON.stringify(options?.initialContent ?? {}, null, 2),
    })
  );
}

function editJSON(file, contentOrCallback, options) {
  const content =
    typeof contentOrCallback === "function"
      ? contentOrCallback(readJSON(file, options))
      : contentOrCallback;
  fs.writeFileSync(file, JSON.stringify(content, null, 2), "utf-8");
}

module.exports = {
  readFile,
  editFile,
  readJSON,
  editJSON,
};
