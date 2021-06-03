/**
* detects current locale, loads dictionary from server
*
**/

import {notCommon} from 'not-bulma';

import notLocale from './notLocale.js';

class nsLocale{
  constructor(app){
    this.app = app;
    this.init();
    this.app.on('wsClient:main:ready', this.update.bind(this));
  }


  /**
  * Creates network interface for this service
  */
  async init(){
    try{
      this.interface = this.app.getInterface('locale')({});
    }catch(e){
      notCommon.report(e);
    }
  }

  /**
  * Retrieves dictionary for current locale
  * sets dictionary in notLocale object
  */
  async update(){
    try{
      let dict = await this.interface.$get({locale: this.getCurrentLocale()});
      if(dict && dict.status === 'ok' && dict.result){
        notLocale.set(dict.result);
      }
    }catch(e){
      notCommon.report(e);
    }
  }

  /**
  * @returns {string}   code of current locale
  **/
  getCurrentLocale(){
    return this.app.getWorking('locale', this.app.getOptions('modules.locale.default', 'ru'));
  }

  /**
  * @returns {Promise<Array>}   of locales objects {code, title}
  **/
  getAvailable(){
    return this.interface.$available({});
  }

}


export default nsLocale;
