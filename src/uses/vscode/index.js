const { editJson } = require("../../helper/file");
const { editCacheConfig } = require("../../helper/util");

const paths = require("../../helper/paths");
const fs = require("fs-extra");
const os = require("os");

function useVscode() {
  const vscodeExtensionsPath = paths.resolvePath(".vscode/extensions", {
    dir: os.homedir(),
  });

  editJson(
    paths.resolvePath(".vscode/settings.json"),
    (json) => {
      const newJson = {
        ...json,
        "editor.formatOnPaste": true,
        "editor.formatOnSave": true,
      };
      const isPrettierInstalled = fs
        .readdirSync(vscodeExtensionsPath)
        .some((dir) => dir.startsWith("esbenp.prettier-vscode"));
      if (isPrettierInstalled) {
        newJson["editor.defaultFormatter"] = "esbenp.prettier-vscode";
      }
      return newJson;
    },
    {
      createWhenNotExist: true,
    }
  );

  editCacheConfig((c) => {
    if (!c.editor) c.editor = [];

    return {
      ...c,
      editor: [...new Set([...c.editor, "vscode"])],
    };
  });
}

module.exports = useVscode;
