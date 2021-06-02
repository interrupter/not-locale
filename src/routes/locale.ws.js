const notNode = require('not-node');

async function get({data}){
	let result = await notNode.Application.getLogic('Locale').get({locale: data.locale});
	return result;
}

async function available(){
	let result = await notNode.Application.getLogic('Locale').available();
	return result;
}

module.exports = {
	servers:{
		main:{
			request: {
				get,
				available
			}
		}
	}
};
