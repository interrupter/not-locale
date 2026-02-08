/**
 * Fat and dirty solutions for common locale determination and response adjustments
 * @module not-locale/lib
 */

const //loadJsonFile = require('load-json-file'),
    Log = require("not-log")(module, "not-locale"),
    fs = require("fs"),
    notPath = require("not-path"),
    path = require("path");

let store = {},
    OPTS = {
        default: "en",
        getter: null,
    };

/**
 * Express middleware, to determine in which locale should we process response
 */

function detect(req, res, next) {
    let reqLang;
    if (OPTS.getter) {
        reqLang = OPTS.getter(req);
    } else {
        reqLang = req.get("Accept-Language");
    }
    if (Object.prototype.hasOwnProperty.call(store, reqLang)) {
        res.locals.locale = reqLang;
    } else {
        res.locals.locale = OPTS.default;
    }
    next();
}

/**
 * Express middleware initializer, to determine in which locale should we process response
 * @param {object} options - object with `deafult` {string}, `getter` {function} redefined
 * @return {function} function wich will accept three params (req, res, next) and run as express middleware
 */

exports.getMiddleware = (options) => {
    if (options) {
        if (options.default && options.default.length > 1) {
            OPTS.default = options.default;
        }
        if (options.getter && typeof options.getter === "function") {
            OPTS.getter = options.getter;
        }
    }
    return detect;
};

/**
 * Add locale by json object
 * @param {string} locale - name of locale
 * @param {json} json - json object
 */
exports.fromJSON = (locale, json, prefix = "") => {
    if (prefix) {
        let tmp = {};
        const keys = Object.keys(json);
        keys.forEach((key) => {
            tmp[`${prefix}:${key}`] = json[key];
        });
        json = tmp;
    }
    if (typeof store[locale] !== "undefined") {
        store[locale] = Object.assign(store[locale], json);
    } else {
        store[locale] = Object.assign({}, json);
    }
};

/**
 * Load locales from directory, with json files, names as [locale_name].json
 * @param {number} pathToLocales - absolute path to directory
 * @return {Promise}
 */
exports.fromDir = (pathToLocales, prefix = "") => {
    return new Promise((resolve, reject) => {
        fs.readdir(pathToLocales, (err, items) => {
            if (err) {
                reject(err);
            } else {
                for (let i = 0; i < items.length; i++) {
                    let filename = path.join(pathToLocales, items[i]),
                        stats = fs.lstatSync(filename);
                    if (stats.isFile()) {
                        try {
                            let file = require(filename),
                                [localeName] = items[i].split(".");
                            exports.fromJSON(localeName, file, prefix);
                        } catch (e) {
                            Log.error(e);
                        }
                    } else {
                        continue;
                    }
                }
                resolve();
            }
        });
    });
};

/**
 * Returns localized variant of code phrase
 * @param {string} phrase - code phrase
 * @param {array|object} params - array or hash with params for template parser
 * @return {string} localized variant
 */
function say(phrase, params = {}, locale = OPTS.default) {
    try {
        let tmpl = store[locale] ? store[locale][phrase] : undefined,
            result = "";
        if (typeof tmpl === "undefined") {
            return phrase;
        }
        if (params) {
            return notPath.parseSubs(tmpl, params, {});
        } else {
            result = tmpl;
        }
        return result;
    } catch (e) {
        Log.error(e);
    }
}

exports.say = say;

/**
 * Getter for stores of all locales
 * @return {objects} all locales
 */
exports.vocabulary = () => {
    return store;
};

/**
 * Getter for OPTS variable
 * @return {object} copy of OPTS object
 */
exports.OPTS = () => {
    return Object.assign({}, OPTS);
};

exports.get = (locale) => {
    if (Object.prototype.hasOwnProperty.call(store, locale)) {
        return store[locale];
    } else {
        return {};
    }
};

exports.available = () => {
    return Object.keys(store);
};

function modulePhrase(moduleName = "") {
    return (phrase) => [moduleName, phrase].join(":");
}

exports.modulePhrase = modulePhrase;

exports.sayForModule = (moduleName = "") => {
    return (phrase, params = {}, locale = OPTS.default) => {
        return say([moduleName, phrase].join(":"), params, locale);
    };
};
