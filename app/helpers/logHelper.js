const log = require("fancy-log");
const chalk = require("chalk");

class Log {
  constructor() {
    this.console = global.console.log;
  }

  console(message) {
    this.console(message);
  }

  normal(message) {
    log(message);
  }

  error(message) {
    const { redBright, black } = chalk;
    log(black.bgRed(" Error "), redBright(message));
  }

  warning(message) {
    const { yellow, black } = chalk;
    log(black.bgYellow(" Warning "), yellow(message));
  }

  info(message) {
    const { blueBright, black } = chalk;
    log(black.bgBlue(" Info "), blueBright(message));
  }

  success(message) {
    const { greenBright, black } = chalk;
    log(black.bgGreen(" Success "), greenBright(message));
  }
}

module.exports = new Log();
