const notLocale = require("../common/lib.js");
const {
    LocaleExceptionGetError,
    LocaleExceptionAvailableError,
} = require("../exceptions");

const MODEL_NAME = "Locale";
exports.thisLogicName = MODEL_NAME;

class LocaleLogic {
    static async get({ locale }) {
        try {
            let result = notLocale.get(locale);
            return result;
        } catch (err) {
            throw new LocaleExceptionGetError({ locale }, err);
        }
    }

    static async available() {
        try {
            let result = notLocale.available();
            return result;
        } catch (err) {
            throw new LocaleExceptionAvailableError({}, err);
        }
    }
}

exports[MODEL_NAME] = LocaleLogic;
