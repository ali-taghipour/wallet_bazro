const _ = require("lodash");
const log = require("./logHelper");

class Exception extends Error {
  constructor(error, isThrow) {
    super(error);
    this.extensions = error;
    this.isThrow = isThrow;
  }

  static setError(error, isThrow) {
    try {
      if (!error.extensions && _.isObject(error)) {
        return new Exception(error, isThrow);
      }

      if (_.isString(error)) {
        return new Exception(error, isThrow);
      }

      return error;
    } catch (err) {
      log.error(`custom error faild, ${err.message}`);
      throw new Error(err.message);
    }
  }
}

module.exports = Exception;
