const ts = require("ts-morph");
const { resolvePath } = require("fpd-utils");
const pc = require("picocolors");

function ast(filePath, handler) {
  const project = new ts.Project({
    manipulationSettings: {
      indentationText: ts.IndentationText.TwoSpaces,
    },
  });
  filePath = resolvePath(filePath, { autoFindExt: true });
  const sourceFile = project.addSourceFileAtPath(filePath);
  const getProperty = (
    obj,
    name,
    { defaultValue, kind = ts.SyntaxKind.ObjectLiteralExpression } = {}
  ) => {
    let property = obj.getProperty(name);
    if (!property) {
      property = obj.addPropertyAssignment({
        name,
        initializer: defaultValue,
      });
    }

    const value = property.getFirstDescendantByKind(kind);

    if (!value) {
      console.log(
        pc.yellow(`Property named ${pc.italic(pc.blueBright(name))} not found.`)
      );
    }
    return value;
  };
  const getModuleProperty = (name, { type = "cjs", ...otps } = {}) => {
    if (type === "cjs") {
      const binaryExpressions = sourceFile.getDescendantsOfKind(
        ts.SyntaxKind.BinaryExpression
      );

      const moduleExports = binaryExpressions.find((expr) => {
        return expr.getLeft().getText() === "module.exports";
      });
      const logNoExportObject = () =>
        console.log(
          pc.yellow(
            `No default export found, such as ${pc.italic(
              pc.greenBright(`module.exports = {${pc.gray("...")}}`)
            )}`
          )
        );
      if (!moduleExports) return logNoExportObject();

      const exportObject = moduleExports.getRight();
      const isExportObjectExists =
        exportObject &&
        exportObject.getKind() === ts.SyntaxKind.ObjectLiteralExpression;

      if (!isExportObjectExists) return logNoExportObject;

      return getProperty(exportObject, name, otps);
    }
  };
  handler({
    sourceFile,
    ts,
    pc,
    getModuleProperty,
    getProperty,
  });

  sourceFile.saveSync();
  project.removeSourceFile(sourceFile);
}

module.exports = ast;
