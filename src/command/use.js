const { execPromise } = require("../helper/util");

function use(program) {
  program
    .command("use")
    .description("Quickly use a function")
    .action(() => {
      // @TODO 支持自定义功能实现 -p './xxx.js'
    });
}

module.exports = use;