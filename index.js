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
		models:  __dirname + '/models',
		controllers:  __dirname + '/controllers',
    logics:  __dirname + '/logics',
		routes:  __dirname + '/routes',
	},
	middleware, fromJSON, fromDir, say, vocabulary, OPTS
};
