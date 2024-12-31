const {
  execPromise,
  baseCommandOptions,
  readCacheConfig,
  editCacheConfig,
} = require("../helper/util");

function init(program) {
  baseCommandOptions(program)
    .command("init")
    .description("Quickly initialize a project")
    .action(() => {
      const config = readCacheConfig();
      const {
        packageManager = "npm",
        frame,
        platform,
      } = {
        ...config,
        ...program.opts(),
      };

      let shs = [packageManager, "init", packageManager === "npm" ? "-y" : ""];
      execPromise(shs);
      editCacheConfig({
        packageManager,
        frame,
        platform,
      });
    });
}

module.exports = init;
