/**
* detects current locale, loads dictionary from server
*
**/

import {notCommon, notLocale} from 'not-bulma';

class nsLocale{
  constructor(app){
    this.app = app;
    this.app.on('wsClient:main:ready', this.update.bind(this));
    notLocale.on('change', ()=>{
      this.app.emit('locale');
    });
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
      let res = await this.interface({locale: this.getCurrentLocale()}).$get({});
      if(res.status === 'ok' && res.result){
        notLocale.set(res.result);
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
