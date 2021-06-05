/**
* detects current locale, loads dictionary from server
*
**/

const SECTION_ID = 'locale';

import {notCommon, notLocale, TopMenu} from 'not-bulma';

class nsLocale{
  constructor(app){
    this.app = app;
    this.locales = [];
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
      await this.updateAvailable();
      let res = await this.interface({locale: this.getCurrentLocale()}).$get({});
      if(res.status === 'ok' && res.result){
        notLocale.set(res.result);
      }
    }catch(e){
      notCommon.error(e);
    }
  }

  async updateAvailable(){
    try{
      let res = await this.interface({}).$available({});
      if(res.status === 'ok' && res.result){
        this.setAvailable(res.result);
      }
    }catch(e){
      notCommon.error(e);
    }
  }

  updateUI(list){
    let menuItems = this.createMenuItems(list);
    TopMenu.updateSectionItems(SECTION_ID, () => {
      return menuItems;
    });
    setTimeout(()=>{
      this.app.emit(`tag-${SECTION_ID}:update`, {
        title: this.getCurrentLocale()
      });
    }, 1000);
  }

  createMenuItems(list) {
    let items = list.map(this.createMenuItem.bind(this));
    return items;
  }

  createMenuItem(item) {
    return {
      id: `${SECTION_ID}.${item}`,
      section: SECTION_ID,
      title: item,
      classes: ' is-clickable ',
      action: this.changeLocale.bind(this, item)
    };
  }

  changeLocale(locale){
    this.saveLocaleToStore(locale);
    this.update();
  }

  /**
  * @returns {string}   code of current locale
  **/
  getCurrentLocale(){
    let stored = this.restoreLocaleFromStore();
    if (stored){
      if(this.locales.includes(stored)){
        return stored;
      }
    }
    return this.selectBest();
  }

  /**
  * @returns {Promise<Array>}   of locales objects {code, title}
  **/
  getAvailable(){
    return this.interface().$available({});
  }


  setAvailable(list){
    this.locales = list;
    this.updateUI(list);
  }

  restoreLocaleFromStore(){
    if (window.localStorage) {
    	try {
    	  return window.localStorage.getItem('locale');
      } catch (e) {
        this.app.error(e);
        return false;
      }
    }
    return false;
  }

  saveLocaleToStore(locale){
    if (window.localStorage) {
    	try {
    	  return window.localStorage.setItem('locale', locale);
      } catch (e) {
        this.app.error(e);
        return false;
      }
    }
    return false;
  }

  selectBest(){
    if(navigator.languages){
      let locale = navigator.languages.find((itm) => {
        return this.locales.includes(itm);
      });
      if(locale){
        return locale;
      }
    }
    return this.app.getWorking('locale', this.app.getOptions('modules.locale.default', 'ru'));
  }

}


export default nsLocale;
