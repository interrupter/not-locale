const { notError } = require("not-error");

class LocaleExceptionGetError extends notError {
    constructor(params = {}, cause) {
        super(`not-locale:exception_logic_get`, params, cause);
    }
}

module.exports.LocaleExceptionGetError = LocaleExceptionGetError;

class LocaleExceptionAvailableError extends notError {
    constructor(params = {}, cause) {
        super(`not-locale:exception_logic_available`, params, cause);
    }
}

module.exports.LocaleExceptionAvailableError = LocaleExceptionAvailableError;
