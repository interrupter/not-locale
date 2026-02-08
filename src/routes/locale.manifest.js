const { error } = require("not-log")(module, "locale:route");

try {
    module.exports = {
        model: "locale",
        url: "/api/:modelName",
        fields: {},
        actions: {
            get: {
                ws: true,
                method: "GET",
                isArray: false,
                postFix: "/:actionName",
                data: ["record"],
                rules: [
                    {
                        auth: true,
                    },
                    {
                        auth: false,
                    },
                ],
            },
            available: {
                ws: true,
                method: "GET",
                isArray: false,
                postFix: "/:actionName",
                data: ["record"],
                rules: [
                    {
                        auth: true,
                    },
                    {
                        auth: false,
                    },
                ],
            },
        },
    };
} catch (e) {
    error(e);
}
