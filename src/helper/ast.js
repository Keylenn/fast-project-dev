const { Project } = require("ts-morph");
const path = require("path");

function ast(filePath, handler) {
  const project = new Project();
  filePath = path.join(process.cwd(), filePath);
  const sourceFile = project.addSourceFileAtPath(filePath);
  handler(sourceFile);

  sourceFile.saveSync();
  project.removeSourceFile(sourceFile);
}

module.exports = ast;
