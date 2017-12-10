const expect = require("chai").expect,
	locale = require('../index.js'),
	path = require('path');

let testJSON = {
		login: "__login",
		password: '__password'
	},
	additionalJSON = {
		password2: '__password2'
	};

describe("fromJSON", function() {
	it("load from custom json", function() {
		locale.fromJSON('custom', testJSON);
		expect(locale.vocabulary().custom).to.deep.equal(testJSON);
	});

	it("load addional custom json", function() {
		locale.fromJSON('custom', additionalJSON);
		expect(locale.vocabulary().custom).to.deep.equal(Object.assign({},additionalJSON,testJSON));
	});

});

describe("fromDir", function() {

	it("load two files from locales directory", function() {
		locale.fromDir(path.join(__dirname, 'locales'))
			.then(()=>{
				expect(locale.vocabulary()).to.include.all.keys('en', 'ru');
			})
			.catch((e)=>{
				console.error(e);
				expect(true).to.be.equal(false);
			});

	});

	it("try to load files from wrong locales directory", function() {
		locale.fromDir(path.join(__dirname, 'locales_not_exists'))
			.then(()=>{
				expect().fail();
			})
			.catch((e)=>{
				expect(true).to.be.ok;
			});

	});

	it("try to load falty json files", function() {
		locale.fromDir(path.join(__dirname, 'faulty.locales'))
			.then(()=>{
				expect().fail();
			})
			.catch((e)=>{
				expect(true).to.be.ok;
			});

	});

});


describe("change", function() {
	it("change from current(ru) to en", function() {
		locale.change('en');
		expect(locale.current()).to.be.equal('en');
	});
});

describe("say", function() {
	it("say login in current(en) locale", function() {
		expect(locale.say('login')).to.be.equal('login');
	});
	it("say login in default(en) password", function() {
		expect(locale.say('password')).to.be.equal('password');
	});

	it("phrase not exists `like`", function() {
		expect(locale.say('like')).to.be.undefined;
	});

	it("locale not exists, should throw", function() {
		locale.change('po');
		expect(locale.say('like')).to.throw;
		locale.change('en');
	});
});

describe("middleware", function() {
	it("pass in express request mockup with Accept-Language: ga ", function() {
		locale.vocabulary()['ga'] = {
			'login':'ga__login',
			'password':'ga__password'
		};
		let reqMock = {
			get(){
				return 'ga';
			}
		};
		locale.middleware()(reqMock, false, ()=>{
			expect(locale.current()).to.be.equal('ga');
		});
	});

	it("init middleware with option default: ru", function() {
		locale.middleware({default: 'ru'});
		expect(locale.OPTS().default).to.be.equal('ru');
	});

	it("init middleware with empty options", function() {
		locale.middleware({});
		expect(locale.OPTS().default).to.be.equal('ru');
	});

	it("pass in express request mockup with Accept-Language: it, that is not in locales list ", function() {
		let reqMock = {
			get(){
				return 'it';
			}
		};
		locale.middleware()(reqMock, false, ()=>{
			expect(locale.current()).to.be.equal(locale.OPTS().default);
		});
	});

	it("init middleware with custom getter", function() {
		let middleware = locale.middleware({
			getter:(req)=>{
				return req.user.lang;
			}});
		middleware({user:{lang:'custom'}}, false, ()=>{
			expect(locale.current()).to.be.equal('custom');
		});
	});
});
