const notNode = require("not-node");

async function get({ data }) {
    return await notNode.Application.getLogic("Locale").get({
        locale: data.locale,
    });
}

async function available() {
    return await notNode.Application.getLogic("Locale").available();
}

module.exports = {
    servers: {
        //collection type
        main: {
            //collection name
            request: {
                //routes(end-points) type
                get, //end-points
                available,
            },
        },
    },
};
