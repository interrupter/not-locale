const {
	middleware,
	fromJSON,
	fromDir,
	say,
	vocabulary,
	OPTS
} = require('./src/common/lib.js');

module.exports = {
	name: 'not-locale',
	paths:{
		controllers:  __dirname + '/src/controllers',
    logics:  __dirname + '/src/logics',
		routes:  __dirname + '/src/routes',
	},
	middleware, fromJSON, fromDir, say, vocabulary, OPTS
};
