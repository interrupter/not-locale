import nsLocale from './nsLocale';
import notLocale from './notLocale';

const services = { nsLocale };
const manifest = {
  modules:{
    locale:{
      default: 'ru'
    }
  }
};

export { services, manifest, notLocale };
