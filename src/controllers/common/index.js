import nsLocale from './nsLocale';

const services = { nsLocale };
const manifest = {
  modules:{
    locale:{
      default: 'ru'
    }
  },
  menu:{
    top:{
      sections:[
				{
					id: 'locale',
          title: '',
					icon: {
						font: 'language',
						size: 'medium',
						svg: '',
						src: '',
					},
					tag: {
						padding: 	'small',
						bold: 		true,
						color: 		'success',
						title: 		''
					},
					showOnTouch: true,
					place: 'end'
				}
			]
    }
  }
};

export { services, manifest};
