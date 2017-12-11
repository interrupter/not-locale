/**
 * Fat and dirty solutions for common locale determination and response adjustments
 * @module not-locale/lib
 */

const loadJsonFile = require('load-json-file'),
	fs = require('fs'),
	format = require('string-format'),
	path = require('path');

var store = {},
	OPTS = {
		default: 'en',
		getter: null
	},
	CURRENT = 'ru';

	/**
	* Express middleware, to determine in which locale should we process response
	* @param {object} options - object with `deafult` {string}, `getter` {function} redefined
	* @return {function} function wich will accept three params (req, res, next) and run as express middleware
	*/

exports.middleware = (options)=>{
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


/**
  * Add locale by json object
  * @param {string} locale - name of locale
  * @param {json} json - json object
  */
exports.fromJSON = (locale, json)=>{
	if (typeof store[locale] !== 'undefined'){
		store[locale] = Object.assign(store[locale], json);
	}else{
		store[locale] = Object.assign({}, json);
	}
};

/**
  * Load locales from directory, with json files, names as [locale_name].json
  * @param {number} pathToLocales - absolute path to directory
  * @return {Promise}
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
  * Returns localized variant of code phrase
  * @param {string} phrase - code phrase
  * @param {array|object} params - array or hash with params for template parser
  * @return {string} localized variant
  */
exports.say = (phrase, params = []) => {
	try{
		let tmpl = store[CURRENT][phrase],
			result= '';
		if (params){
			if(Array.isArray(params)){
				result = format(tmpl, ...params);
			}else{
				result = format(tmpl, params);
			}
		}else{
			result = tmpl;
		}
		return result;
	}catch(e){
		//!TODO replace on not-error/not-error-report
		//console.error(e);
	}
};

/**
  * Getter for stores of all locales
  * @return {objects} all locales
  */
exports.vocabulary = () => {return store;};

/**
  * Getter for CURRENT locale
  * @return {string} current locale name
  */
exports.current = () => {return CURRENT;};

/**
  * Changes CURRENT locale
  * @param {string} locale - locale name
  */
exports.change = (locale) => { CURRENT = locale;};

/**
  * Getter for OPTS variable
  * @return {object} copy of OPTS object
  */
exports.OPTS = () => { return Object.assign({}, OPTS);};
