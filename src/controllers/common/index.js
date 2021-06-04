import nsLocale from './nsLocale';

const services = { nsLocale };
const manifest = {
  modules:{
    locale:{
      default: 'ru'
    }
  }
};

export { services, manifest};
