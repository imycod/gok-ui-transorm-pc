import http from './http'
import auth from './auth'
import local from './local'
import token from './token'
import api from './api'

/**
 *  用户中心模块
 */
const ucCls = function(context,util) {
	let that = this
	/**
	 * 判断是否登录，初始化登录信息
	 */
	this.initUc = function () {
		return new Promise((r,j) => {
			if(context.isBrowser) {
				if(!that.api.isLogined()) {
					let code = util.getQueryVariable('code')
					if(code) {
						that.api.changeToken(code).then(res => { r(res) }).catch(err => { j(err) })
					} else {
						j()
					}
				} else {
					r()
				}
			}
		})
	}
}

/**
 *  export
 */
export default function(importModule) {
	const uc = new ucCls(this.context, this.util)
	importModule.call(uc, 'http', http, this.context, this.constant, this.util)
	importModule.call(uc, 'auth', auth, this.context, this.constant, this.util)
	importModule.call(uc, 'local', local, this.context, this.constant, this.util)
	importModule.call(uc, 'token', token, this.context, this.constant, this.util)
	importModule.call(uc, 'api', api, this.context, this.constant, this.util)
	return uc
}
