const { Project } = require("ts-morph");
const paths = require("./paths");

function ast(filePath, handler) {
  const project = new Project();
  filePath = paths.resolvePath(filePath, { autoFindExt: true });
  const sourceFile = project.addSourceFileAtPath(filePath);
  handler(sourceFile);

  sourceFile.saveSync();
  project.removeSourceFile(sourceFile);
}

module.exports = ast;
