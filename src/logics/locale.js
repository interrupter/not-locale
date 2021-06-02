const notNode = require('not-node');
const Log = require('not-log')(module, 'locale:logics');
const {
	notError
} = require('not-error');

const notLocale = require('../common/lib.js');

const MODEL_NAME = 'Locale';
exports.thisLogicName = MODEL_NAME;

class LocaleLogic {
	static async get({
		locale
	}){
		try{
			let result = notLocale.get(locale);
			return {
				status: 'ok',
				result
			};
		}catch(err){
			Log.error(err);
			notNode.Application.report(
				new notError(
					`locale:logic.get`,
					{locale},
					err
				)
			);
			return {
				status: 'error',
				error:  err.message
			};
		}
	}

	static async available() {
		try{
			let result = notLocale.available();
			return {
				status: 'ok',
				result
			};
		}catch(err){
			Log.error(err);
			notNode.Application.report(
				new notError(
					`locale:logic.available`,
					{},
					err
				)
			);
			return {
				status: 'error',
				error:  err.message
			};
		}
	}

}

exports[MODEL_NAME] = LocaleLogic;
