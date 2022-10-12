/**
 * UC模块接口
 */
const UC_API = {
	pwd_login_init: '/uc/v1/users/pwd-login/init', // 账号密码登录初始化
	pwd_login: '/uc/v2/users/pwd-login', // 账号密码登录
	// 2022-05-25 登录接口修改，改为未注册手机号登录后自动注册
	// acquire_sms: '/uc/v1/users/smscode-login/acquire-sms', // 获取手机验证码
	acquire_sms: '/uc/teaching/v1/auto-login/acquire-sms', // 获取手机验证码-自动登录
	// 2022-05-25 登录接口修改，改为未注册手机号登录后自动注册
	// smscode_login: '/uc/v2/users/smscode-login', // 手机验证码登录
	smscode_login: '/uc/teaching/v1/auto-login', // 手机验证码登录-自动登录
	refresh_token: '/uc/v1/users/refresh-token', // 刷新token
	change_token: '/uc/v1/users/token', // code换取token
	setTenant: (tenantId) => `/uc/v1/users/switch-tenant/${tenantId}`, // 设置租户
	getTenants: '/uc/v1/users/tenants', // 获取租户列表
	logout: '/v1/users/logout' // 退出登录
}

/**
 * APP端UC模块API接口
 */
const APP_UC_API = {
	pwd_login_init: '/uc/app/v1/pwd-login/init', // pwd登录初始化
	pwd_login: '/uc/app/v1/pwd-login', //账号密码登录
	acquire_sms: '/uc/app/v1/sms-login/acquire-sms', // 获取手机验证码
	smscode_login: '/uc/app/v1/sms-login', // 手机验证码登录
	refresh_token: '/uc/v1/users/refresh-token', // 刷新token
	change_token: '/uc/app/v1/users/token', // 换取token
	setTenant: (tenantId) => `/uc/v1/users/switch-tenant/${tenantId}`, // 设置租户
	getTenants: '/uc/v1/users/tenants', // 获取租户列表
	logout: '/v1/users/logout' // 退出登录
}

/**
 * 用户中心模块相关请求API
 * @param {object} context 上下文模块
 * @param {object} constant 常量模块
 * @param {object} util 工具函数模块
 * @param {object} token token模块
 * @param {object} http http请求模块
 * @param {object} local local模块
 */
let api = function(context, constant, util, token, http, local) {
	// UC相关API的接口地址对象
	const API_URL_OBJ = context.isApp ? APP_UC_API : UC_API;
	/**
	 * 登录初始化
	 */
	let loginInit = function (username) {
		return new Promise((resolve, reject) => {
			http.post(API_URL_OBJ.pwd_login_init, { data: { username } }).then(res => { resolve(res) }).catch(err => { reject(err) })
		})
	}
	/**
	 * 退出登录的请求
	 */
	let logoutHttp = function () {
		return new Promise((resolve, reject) => {
			http.post(API_URL_OBJ.logout, {}).then(res => { resolve(res) }).catch(err => { reject(err) })
		})
	}
	/**
	 * 账号密码登录
	 */
	this.login = function (username, password, mpRid) {
		return new Promise((resolve, reject) => {
			loginInit(username).then(res => {
				password = util.cryptoJs.MD5(password).toString()
				password = util.cryptoJs.HmacSHA256(password, res.data.rid)
				password = util.cryptoJs.enc.Base64.format(password)
				http.post(API_URL_OBJ.pwd_login, { data: {
					username,
					password,
					rid: res.data.rid,
					mpRid
				} }).then(res => {
					resolve({
						data: res.data,
						status: res.status,
						statusText: res.statusText,
						code: util.base64.encrypt(token.getHeaderCode(res))
					})
				}).catch(err => { reject(err) })
			})
		})
	}

	/**
	 * 手机验证码登录 - 获取手机验证码
	 * @params {String} phone - 手机号
	 */
	this.getSmsCode = function (phone) {
		return new Promise((r,j) => {
			http.post(API_URL_OBJ.acquire_sms, { data: { phone } }).then(res => { r(res) }).catch(err => { j(err) })
		})
	}

	/**
	 * 手机验证码登录
	 * @params {String} phone - 手机号
	 * @params {String} smsCode - 验证码
	 * @params {String} rId - 获取验证码的返回值，即请求ID
	 */
	this.loginByPhone = function (phone, smsCode, rid, unionId, openId) {
		return new Promise((resolve, reject) => {
			http.post(API_URL_OBJ.smscode_login, { data: { phone, smsCode, rid, unionId, openId } }).then(res => {
				resolve({
					data: res.data,
					status: res.status,
					statusText: res.statusText,
					code: util.base64.encrypt(token.getHeaderCode(res))
				})
			}).catch(err => { reject(err) })
		})
	}

	/**
	 * 刷新token
	 */
	this.refreshToken = function () {
		return new Promise((resolve, reject) => {
			http.post(API_URL_OBJ.refresh_token, { headers: { contentType: 'application/x-www-from-urlencoded' } }).then(res => {
				token.storeToken(res);
				token.storeMackey(res);
				resolve({
					data: res.data,
					status: res.status,
					statusText: res.statusText
				})
			}).catch(err => { reject(err) })
		})
	}

	/**
	 *  一次性token换取签名token
	 */
	this.changeToken = function(code) {
		return new Promise((r, j) => {
			if (!code) {
				j({message: 'code不能为空'})
				return
			}
			try {
				const codeObj = JSON.parse(util.base64.parse(code));
				http.get(API_URL_OBJ.change_token,{ params: {
					code: codeObj.code,
					uid: codeObj.uid
				} }).then(res => {
					local.setDiffTime(res);
					token.storeToken(res);
					token.storeMackey(res);
					r (res)
				}).catch(err => { j(err) })
			} catch (err) {
				j({message: 'code解析错误'});
			}
		})
	}

	/**
	 *  请求之前判断token是否需要刷新
	 */
	this.request = function(config) {
		/**
		 *  请求
		 */
		let fn = function() {
			return new Promise( (r, j) => {
				http.request(config).then(res => { r(res) }).catch(err => { j(err) })
			})
		}
		/**
		 *  token是否过期
		 */
		if (token.isTokenExp()){
			return new Promise( (r,j) => {
				this.refreshToken().then(res => {
					fn().then(res => { r(res) }).catch(err => { j(err) })
				}).catch(err => { j(err) })
			})
		}else {
			return fn()
		}
	}

	/**
	 * 是否登录，但不表示token已经过期
	 * 注：1.未登录过，无token和mackey
	 * 		2.token过期
	 */
	this.isLogined = function () {
		const tokenData = token.getToken(),
					mackeyData = token.getMackey();
		return mackeyData && tokenData && !token.isTokenExp();
	}

	/**
	 * 退出登录，删除登录信息和用户信息
	 * @param {Object} params
	 * @param {String} params.type 【 normal - 常规退出，请求接口/ local - 本地退出，不需要请求接口 】
	 * @param {String} params.redirect 退出登录后的重定向地址
	 */
	this.logout = function (params = { type: 'normaml' }) {
		try {
			if (params.type === 'normal') logoutHttp()
		}
		catch (err) {}
		finally {
			token.removeMackey();
			token.removeToken();
			if (typeof params.fn === 'function') {
				params.fn();
				return
			}
			this.redirect(params.redirect);
		}
	}

	/**
	 * 重定向
	 */
	this.redirect = function (redirectUrl) {
		// 如果有设置重定向登录函数则统一走重定向登录函数
		if (typeof context.directionLogin === 'function') {
			context.directionLogin();
			return
		}
		const redirectObj = {
			dev: function () {
				window.location.href = '/login';
			},
			test: function () {
				if (context.redirection) {
					window.location.href = redirectUrl || constant.ucDomain + '?redirect_url=' + util.base64.encrypt(window.location.href);
				} else {
					window.location.href = redirectUrl || constant.ucDomain;
				}
			},
			prod: function () {
				if (context.redirection) {
					window.location.href = redirectUrl || constant.ucDomain + '?redirect_url=' + util.base64.encrypt(window.location.href);
				} else {
					window.location.href = redirectUrl || constant.ucDomain;
				}
			}
		}
		// 如果是浏览器
		if (context.isBrowser) {
			redirectObj[context['env']]();
			return
		}
		// 如果是uni-app开发的应用
		if (!context.isBrowser && ontext.isUniApp) {
			uni.reLaunch({ url: redirectUrl || constant.ucDomain})
		}
	}
	/**
	 * 
	 * @param {String} url 
	 * @param {String} fileName - 文件名称
	 */
	 this.getBinaryFile = function (url, fileName) {
		http.request({
			method: 'GET',
			url,
			responseType: 'blob'
		}).then(res => {
			if (!res.data) {
				return false;
			}
			// 处理返回的文件流
			if ('download' in document.createElement('a')) {
				// 非IE下载
				const elink = document.createElement('a');
				elink.download = fileName;
				elink.style.display = 'none';
				elink.href = URL.createObjectURL(new Blob([res.data]));
				document.body.appendChild(elink);
				elink.click();
				URL.revokeObjectURL(elink.href); // 释放URL 对象
				document.body.removeChild(elink);
			} else {
				// IE10+下载
				navigator.msSaveBlob(res, fileName);
			}
		})
	}
	/**
	 * @date 2022-01-18
	 * @des 获取租户列表
	 * 注：对应版本版本V210
	 */
	this.getTenants  = function () {
		return new Promise((resolve, reject) => {
			http.get(API_URL_OBJ.getTenants, { params: {} }).then(res => {
				resolve({
					data: res.data,
					status: res.status,
					statusText: res.statusText
				})
			}).catch(err => { reject(err) })
		})
	}

	/**
	 * @date 2022-01-18
	 * @des 设置当前租户
	 * 注：对应版本版本V210
	 */
	this.setTenant  = function (tenantId) {
		return new Promise((resolve, reject) => {
			http.get(API_URL_OBJ.setTenant(tenantId), { params: {} }).then(res => {
				local.setDiffTime(res);
				token.storeToken(res);
				token.storeMackey(res);
				resolve({
					data: res.data,
					status: res.status,
					statusText: res.statusText
				})
			}).catch(err => {
				reject(err)
			})
		})
	}
}
// export
export default function(context, constant, util) {
	return new api(context, constant, util, this.token, this.http, this.local)
}