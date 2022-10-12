/**
 * cookie 相关
 */
import cookie from 'js-cookie'
/**
 * cookie，默认存取在父级域名
 * @param {object} context 
 */
const cookieProxyCls = function(constant) {
	// cookie有效时长
	const cookieExp = constant.cookieExp || 7;
	/**
	 * 存储cookie
	 */
	this.storeCookie = function(key, value) {
		cookie.set(key, value, {
			domain: constant.cookieDomain,
			expires: Number(cookieExp)
		})
	}

	/**
	 * 获取key
	 */
	this.getCookie = function(key) {
		return cookie.get(key);
	}

	/**
	 * 删除key
	 */
	this.removeCookie = function(key) {
		cookie.set(key, '', {
			domain: constant.cookieDomain,
			expires: Number(-1)
		})
}
}

export default function(constant) {
	return new cookieProxyCls(constant)
}

