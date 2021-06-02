/**
* Purpose of this Locale object is that it will hold library of localization
* templates and provide basic localization service to other modules
**/

import EventEmitter from 'wolfy87-eventemitter';
import {
  writable
} from 'svelte/store';

import {notCommon, notPath} from 'not-bulma';

const store = writable({});

class notLocale extends EventEmitter{
  constructor(){
    super();
    this.dict = {};          //dictionary of phrases
    this.helpers = {};        //additional helper functions and constants
  }

  /**
  * String format should comply notPath standart.
  * {path_to_access} - is
  * : - is used to access to params
  * :: - is used to access to helpers
  * Welcome, {:where}! - will replace {:where} with content of params.where
  * Welcome, {::where}! - will replace {:where} with content of this.helpers.where
  * () - after path is to invoke function of target object
  * Welcome, {::where()}! - will try to exec this.helpers.where(params, undefined)
  * @param    {string}  str         localized string template with mark to include data
  * @param    {object}  params      params to use in string
  * @returns  {string}              localized version of string with
  */
  format(str, params){
    return notPath.get(str, params, this.helpers);
  }

  /**
  * Return localized version of string with injected data from provided object
  * may also use Locale.helpers as source of data
  * @param {string}   phrase    name of string to localize
  * @param {object}   params    object with data to inject in phrase template
  * @return {string}            localized string with injected data
  */
  say(phrase, params = {}){
    try{
      if(Object.prototype.hasOwnProperty.call(this.dict, phrase)){
        let tmpl = this.dict[phrase],
          result = '';
        if (params){
          result = this.format(tmpl, params);
        }else{
          result = tmpl;
        }
        return result;
      }else{
        throw new Error(`Unknown locale phrase: ${phrase}`);
      }
    }catch(e){
      notCommon.report(e);
      return phrase;
    }
  }

  /**
  * Setting new dictionary. triggers event 'change'
  * @param {object}     dict      vocabulary of phrases and templates
  **/
  set(dict){
    store.$set(dict);
    this.dict = Object.assign({}, {...dict});
    this.emit('change');
  }

  /**
  * Returns writable store of phrases
  * @return {object}  writable store
  */
  vocabulary(){
    return store;
  }
}



export default new notLocale();
