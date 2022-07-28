const {
    getMiddleware,
    fromJSON,
    fromDir,
    say,
    sayForModule,
    modulePhrase,
    vocabulary,
    OPTS,
} = require("./src/common/lib.js");

module.exports = {
    name: "not-locale",
    paths: {
        controllers: __dirname + "/src/controllers",
        logics: __dirname + "/src/logics",
        locales: __dirname + "/src/locales",
        routes: __dirname + "/src/routes",
    },
    getMiddleware,
    fromJSON,
    fromDir,
    say,
    sayForModule,
    modulePhrase,
    vocabulary,
    OPTS,
};
