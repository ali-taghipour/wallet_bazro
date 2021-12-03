const _ = require("lodash");
const log = require("../../helpers/logHelper");

class RestrictedAreaException extends Error {
    constructor(error, data, isThrow) {
        super(error);
        this.extensions = error;
        this.isThrow = isThrow;
        this.data = data;
    }
}
module.exports = RestrictedAreaException;

