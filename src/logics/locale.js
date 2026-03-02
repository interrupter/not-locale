const notLocale = require("../common/lib.js");
const { MODULE_NAME } = require("../const");
const config = require("not-config").readerForModule(MODULE_NAME);

const {
    LocaleExceptionGetError,
    LocaleExceptionAvailableError,
} = require("../exceptions");

const MODEL_NAME = "Locale";
exports.thisLogicName = MODEL_NAME;

class LocaleLogic {
    static async get({ locale }) {
        try {
            const available = await this.available();
            if (available.includes(locale)) {
                return notLocale.get(locale);
            }
            throw new Error("Locale not available");
        } catch (err) {
            throw new LocaleExceptionGetError({ locale }, err);
        }
    }

    static async available() {
        try {
            const foundedLocales = notLocale.available();
            const configPermitedLocales = config.get("available");
            if (
                configPermitedLocales &&
                Array.isArray(configPermitedLocales) &&
                configPermitedLocales.length
            ) {
                return config.permits.filter((name) =>
                    foundedLocales.includes(name)
                );
            } else {
                return foundedLocales;
            }
        } catch (err) {
            throw new LocaleExceptionAvailableError({}, err);
        }
    }
}

exports[MODEL_NAME] = LocaleLogic;
