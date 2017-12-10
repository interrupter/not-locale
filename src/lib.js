/**
 * this is MyClass.
 */

const loadJsonFile = require('load-json-file'),
	fs = require('fs'),
	path = require('path');

var store = {},
	OPTS = {
		default: 'en',
		getter: null
	},
	CURRENT = 'ru';

	/**
      * @param {number} a - this is a value.
      * @param {number} b - this is a value.
      * @return {number} result of the sum value.
      */

let middleware = (options)=>{
	if (options){
		if (options.default && options.default.length > 1){
			OPTS.default = options.default;
		}
		if (options.getter && typeof options.getter === 'function'){
			OPTS.getter = options.getter;
		}
	}
	let detect = ( req, res, next ) => {
		let reqLang;
		if (OPTS.getter){
			reqLang = OPTS.getter(req);
		}else{
			reqLang = req.get('Accept-Language');
		}
		if (store.hasOwnProperty(reqLang)){
			CURRENT = reqLang;
		}else{
			CURRENT = OPTS.default;
		}
		next();
	};
	return detect;
};

exports.middleware = middleware;
/**
  * @param {number} a - this is a value.
  * @param {number} b - this is a value.
  * @return {number} result of the sum value.
  */
exports.fromJSON = (locale, json)=>{
	if (typeof store[locale] !== 'undefined'){
		store[locale] = Object.assign(store[locale], json);
	}else{
		store[locale] = Object.assign({}, json);
	}
};
/**
  * @param {number} a - this is a value.
  * @param {number} b - this is a value.
  * @return {number} result of the sum value.
  */
exports.fromDir = (pathToLocales)=>{
	return new Promise((resolve, reject)=>{
		fs.readdir(pathToLocales, (err, items) => {
			if (err){
				reject(err);
			}else{
				for(let i = 0; i < items.length; i++) {
					let filename = path.join(pathToLocales, items[i]),
						stats = fs.lstatSync(filename);
					if (stats.isFile()){
						try{
							let file = loadJsonFile.sync(filename),
								[localeName] = items[i].split('.');
							exports.fromJSON(localeName, file);
						}catch(e){
							//console.error(e);
						}
					}else{
						continue;
					}
				}
				resolve();
			}
		});
	});
};
/**
  * @param {number} a - this is a value.
  * @param {number} b - this is a value.
  * @return {number} result of the sum value.
  */

exports.say = (phrase) => {
	try{
		return store[CURRENT][phrase];
	}catch(e){
		//!TODO replace on not-error/not-error-report
		//console.error(e);
	}
};
/**
  * @param {number} a - this is a value.
  * @param {number} b - this is a value.
  * @return {number} result of the sum value.
  */
exports.vocabulary = () => {return store;};
/**
  * @param {number} a - this is a value.
  * @param {number} b - this is a value.
  * @return {number} result of the sum value.
  */
exports.current = () => {return CURRENT;};
/**
  * @param {number} a - this is a value.
  * @param {number} b - this is a value.
  * @return {number} result of the sum value.
  */
exports.change = (locale) => { CURRENT = locale;};
/**
  * @param {number} a - this is a value.
  * @param {number} b - this is a value.
  * @return {number} result of the sum value.
  */
exports.OPTS = () => { return Object.assign({}, OPTS);};
