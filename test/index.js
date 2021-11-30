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

	it("try to load faulty json files", function() {
		locale.fromDir(path.join(__dirname, 'faulty.locales'))
			.then(()=>{
				expect().fail();
			})
			.catch((e)=>{
				expect(true).to.be.ok;
			});

	});

});


describe("say", function() {
	it("say login in default(en) locale", function() {
		expect(locale.say('login')).to.be.equal('login');
	});
	it("say login in default(en) password", function() {
		expect(locale.say('password')).to.be.equal('password');
	});

	it("phrase not exists `like`", function() {
		expect(locale.say('like_me')).to.be.equal('like_me');
	});

	it("locale not exists, should throw", function() {
		expect(locale.say('like', undefined, 'po')).to.throw;
	});

	it("phrase with param and params as Array", function() {
		expect(locale.say('login', ['param zero'], 'ru')).to.be.equal('логин param zero');
	});

	it("phrase with param and params as Object", function() {
		expect(locale.say('password', {none: 'param zero'}, 'ru')).to.be.equal('пароль param zero');
	});

	it("phrase with param and params as null", function() {
		expect(locale.say('password', null, 'ru')).to.be.equal('пароль {none}');
	});
});


describe("say for module", function() {
	it("say login in default(en) locale for not-user module", function() {
		let say = locale.sayForModule('not-user');
		expect(typeof say).to.be.equal('function');
		expect(say('login')).to.be.equal('login for module version');
	});
});

describe("modulePhrase", function() {
	it("prefixes phrase with module name", function() {
		let say = locale.modulePhrase('not-user');
		expect(typeof say).to.be.equal('function');
		expect(say('login')).to.be.equal('not-user:login');
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
		},resMock = {locals:{}};
		locale.getMiddleware()(reqMock, resMock, ()=>{
			expect(resMock.locals.locale).to.be.equal('ga');
		});
	});

	it("init middleware with option default: ru", function() {
		locale.getMiddleware({default: 'ru'});
		expect(locale.OPTS().default).to.be.equal('ru');
	});

	it("init middleware with empty options", function() {
		locale.getMiddleware({});
		expect(locale.OPTS().default).to.be.equal('ru');
	});

	it("pass in express request mockup with Accept-Language: it, that is not in locales list ", function() {
		let reqMock = {
			get(){
				return 'it';
			}
		},resMock = {locals:{}};
		locale.getMiddleware()(reqMock, resMock, ()=>{
			expect(resMock.locals.locale).to.be.equal(locale.OPTS().default);
		});
	});

	it("init middleware with custom getter", function() {
		let middleware = locale.getMiddleware({
			getter:(req)=>{
				return req.user.lang;
			}}),resMock = {locals:{}};
		middleware({user:{lang:'custom'}}, resMock, ()=>{
			expect(resMock.locals.locale).to.be.equal('custom');
		});
	});
});
