/**
* detects current locale, loads dictionary from server
*
**/

import {notCommon} from 'not-bulma';

import notLocale from './notLocale.js';

class nsLocale{
  constructor(app){
    this.app = app;
    this.app.on('wsClient:main:ready', this.update.bind(this));
  }

  /**
  * Creates network interface for this service
  */
  interface(data){
    return this.app.getInterface('locale')(data);
  }

  /**
  * Retrieves dictionary for current locale
  * sets dictionary in notLocale object
  */
  async update(){
    try{
      let dict = await this.interface({locale: this.getCurrentLocale()}).$get({});
      if(dict){
        notLocale.set(dict);
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
    return this.interface().$available({});
  }

}


export default nsLocale;
