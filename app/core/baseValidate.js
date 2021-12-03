const Schema = require("validate");
const _ = require("lodash");
const log = require("../helpers/logHelper");
const ValidationException = require("./exceptions/validationException");

class BaseValidate {
    constructor() {
        this.messages = {
            required: () => `ERROR_MESSAGE_REQUIRED`,
            validation: () => `ERROR_MESSAGE_INVALID`,
            type: () => `ERROR_MESSAGE_WRONG_TYPE`,
            length: () => `ERROR_MESSAGE_INVALID_LENGTH`,
            test: () => `ERROR_MESSAGE_WRONG_TYPE`,
            size: () => `ERROR_MESSAGE_WRONG_VALUE_SIZE`,
        };
        this.useRegexUUID4 = val => val ? /^[0-9a-fA-F]{8}-[0-9A-Fa-f]{4}-[4][0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$/.test(val) : true
        this.useRegexMobilePhone = val => val ? /^09[0-9]{9}$/.test(val) : true
        this.useRegexEmail = val => val ? /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(val) : true
        this.useNumbers = val => val ? /^\d+$/.test(val) : true
    }

    checkValidation(items, schemaOfValidation, throwErrors = true, errorMessages = null) {
        const schema = new Schema(schemaOfValidation, { strip: false });

        if (!errorMessages) errorMessages = this.messages

        schema.message(errorMessages);

        return this.sanitizeErrors(
            schema.validate(items, { strip: false }),
            throwErrors,
        );
    }

    sanitizeErrors(errors, throwErrors) {
        const errorObj = {};
        errors.forEach(error => {
            errorObj[error.path] = error.message
        })
        if (Object.keys(errorObj).length > 0)
            throw new ValidationException("validation error", errorObj, throwErrors);

        return errorObj;
    }
}

module.exports = BaseValidate