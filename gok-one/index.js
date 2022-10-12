import uc from './uc'
import util from './util'
import axios from './axios'
import constant from './constant'
import log from './log'
import errCatch from './err-catch'

/**
 * 判断是否是浏览器环境
 */
let isBrowser = false
try { isBrowser = window ? true : false } catch (err) {}
// 判断是否有uni-app环境
let isUniApp = false;
try { isUniApp = uni ? true : false } catch (err) {}

const defaultContext = {
	isBrowser,
	isUniApp,
	isApp: false,
	domain: {},
	redirection: false
}
/**
 *  sdk
 * @param {string} mode
 * @param {string} appVersion
 */
const one = function(context) {
	// 上下文参数
	this.context = Object.assign(defaultContext, context)
}

const importModule = function(moduleName, module, ...params) {
	const paramsArray = params ? params.concat(importModule) : [importModule]
	this[moduleName] = module.call(this, ...paramsArray)
	return this[moduleName]
}

one.prototype.init = function(fn) {
	this.uc.initUc().then(res => {
		fn()
	}).catch(err => {
		this.uc.api.redirect()
	})
}

/**
 * 构造one对象
 */
const OneBuilder = function() {
	this.context = {}
}

/**
 * 三种环境
 */
OneBuilder.prototype.mode = {
	dev: 'dev',
	test: 'test',
	prod: 'prod'
}
/**
 * 设置环境
 */
OneBuilder.prototype.env = function(env) {
	this.context.env = env
	return this
}

// 设置是否启用mock模式 启用后 在axios请求拦截把 baseUrl去掉
OneBuilder.prototype.setMockMode = function(bol='false') {
	const mock={
		'true':true,
		'false':false,
	}
	this.context.isMockMode = mock[bol]
	return this
}

/**
 * app版本
 */
OneBuilder.prototype.version = function(version) {
	this.context.version = version
	return this
}

/**
 * 设置域名相关配置
 */
OneBuilder.prototype.setDomain = function(domain = {}) {
	try {
		this.context.domain = {
			ucDomain: domain.ucDomain,
			apiDomain: domain.apiDomain,
			cookieDomain: domain.cookieDomain
		};
	}
	catch (err) {}
	return this
}

/**
 * 设置平台用户存储关键字
 */
OneBuilder.prototype.setTokenKey = function(tokenKey) {
	this.context.tokenKey = tokenKey;
	return this
}

/**
 * 设置APP平台标识
 */
OneBuilder.prototype.setApp = function() {
	this.context.isApp = true;
	return this
}

/**
 * 设置htt请求的相应监听
 */
OneBuilder.prototype.setHttpResponseErr = function(fn) {
	this.context.httpResponseErr = fn;
	return this
}

/**
 * 设置htt请求的相应监听
 */
OneBuilder.prototype.setDirection = function() {
	this.context.redirection = true;
	return this
}

/**
 * 设置htt请求的相应监听
 */
OneBuilder.prototype.directionLogin = function(fn) {
	this.context.directionLogin = fn;
	return this
}

/**
 *  构造
 */
OneBuilder.prototype.build = function() {
	/**
	 * 构造one
	 */
	const oneObj = new one(this.context)
	importModule.call(oneObj, 'constant', constant)
	importModule.call(oneObj, 'util', util)
	importModule.call(oneObj, 'axios', axios)
	importModule.call(oneObj, 'uc', uc)
	importModule.call(oneObj, 'log', log)
	importModule.call(oneObj, 'errCatch', errCatch)
	return oneObj
}

OneBuilder.prototype.redirectUrl = function(redirectUrl) {
	this.context.redirectUrl = redirectUrl;
	return this
}

// export
const oneBuilder = new OneBuilder()
export default oneBuilder
