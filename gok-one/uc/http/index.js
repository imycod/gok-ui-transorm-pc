/**
 * 产教融合平台http，附带相关header
 * @param {object} context
 */
 const http = function(context, constant, util) {
	// token失效时允许的最大连续刷新次数
	const REFRESH_STATUS = {
		400: {
			10700: true // 表示在其他平台修改了基本信息引起了token的变化，因此需要更新token
		},
		401: {
			40100: true
		}
	}
	const LOGOUT = {
		400: {
			10702: true,
			10701: true  // 鉴权已过期，服务端暂时不能确定请求状态是400或401，且前端未遇到此错误码，所以两边都加上
		},
		401: {
			40101: true,
			10701: true  // 鉴权已过期，服务端暂时不能确定请求状态是400或401，且前端未遇到此错误码，所以两边都加上
		}
	}
	const AUTO_REFRESH_TIME = 1 * 1000 * 60 * 5; // 5分钟
	let requestList = [];
	let isRefreshToken = false;
	let config = {
		baseURL:!context.isMockMode ? constant.apiDomain :'',
		timeout: 1000,
		headers: {
			'Content-Type': 'application/json',
			'X-AppVer': context.version
		}
	};
	const axiosProxy = new util.axiosProxy(config);

	axiosProxy.proxy().interceptors.request.use(
		config => {
			if (this.token.getToken()) {
				config.headers['X-Authorization'] = this.auth(config.method, config.url);
			}
			const tenant = this.token.getCurTenant();
			// 如果cookie里有租户信息说明已经确定了租户，就携带上租户ID
			if (tenant && tenant.tenantId) config.headers['X-Tenant'] = tenant.tenantId;
			return config
		}
	)
	axiosProxy.proxy().interceptors.response.use(
		res => {
			this.token.storeToken(res);
			this.token.storeMackey(res);
			const expTime = this.token.getExp();
			// token过期前5分钟主动刷新token
			if (expTime && ((expTime - (new Date).getTime()) <= AUTO_REFRESH_TIME)) this.api.refreshToken();
			return Promise.resolve(res);
		},
		err => {
			const errData = err.response;
			// 鉴权过期
			if (LOGOUT[errData.status] && LOGOUT[errData.status][errData.data.code]){
				this.api.logout();
				return
			}
			/**
			 * token变更的处理
			 * 注：1.stauts - 400 / code - 10700 表示在其他平台修改了基本信息引起了token的变化，因此需要更新token
			 * 		2.token内载荷信息变更
			 */
			if (REFRESH_STATUS[errData.status] && REFRESH_STATUS[errData.status][errData.data.code]) {
				if (!isRefreshToken) {
					isRefreshToken = true;
					return this.api.refreshToken().then(refreshRes => {
						requestList.forEach((cb) => cb());
						requestList = [];
						return axiosProxy.proxy()(errData.config);
					}).catch(refreshErr => {
						this.api.logout();
					}).finally(() => {
						isRefreshToken = false;
					})
				} else {
					return new Promise((resolve, reject) => {
						requestList.push(() => {
							resolve(axiosProxy.proxy()(errData.config));
						})
					})
				}
			}
			if (typeof context.httpResponseErr === 'function') context.httpResponseErr(err);
			return Promise.reject(err)
		}
	)

	if (context.isUniApp && !context.isBrowser) {
		const _this = this;
		axiosProxy.proxy().defaults.adapter = function (config) {
			return new Promise((resolve, reject) => {
				const settle = require('axios/lib/core/settle'),
							buildURL = require('axios/lib/helpers/buildURL');
				uni.request({
					method: config.method.toUpperCase(),
					url: constant.apiDomain + buildURL(config.url, config.params, config.paramsSerializer),
					header: config.headers,
					data: config.data,
					dataType: config.dataType,
					responseType: config.responseType,
					sslVerify: config.sslVerify,
					complete: function complete (response) {
						// 401 登录信息失效
						if (LOGOUT[response.statusCode] && LOGOUT[response.statusCode][response.data.code]) {
							_this.api.logout();
						} else {
							response = {
								data: response.data,
								status: response.statusCode,
								errMsg: response.errMsg,
								header: response.header,
								config: config
							};
							settle(resolve, reject, response);
						}
					}
				})
			})
		}
	}
	return axiosProxy
}

export default function(context, constant, util) {
	return http.call(this, context, constant, util)
}
