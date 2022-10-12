import cookie from './cookie'
import cryptoJs from './crypto-js'
import base64 from './base64'
import axiosProxy from './axios-proxy'
import fingerprint from './fingerprint'

/**
 * 常用模块
 */
const utilCls = function(context) {
	/**
	 * 获取浏览器地址栏上的参数
	 * @param {String} variable 参数名称
	 * @returns 参数值
	 */
	this.getQueryVariable = function(variable) {
		if(context.isBrowser) {
			const query = window.location.href.substring(window.location.href.indexOf('?') + 1);
			if (!query) return
			try {
				const vars = query.split('&');
				for (let i = 0; i < vars.length; i++) {
					const pair = vars[i].split('=');
					if(pair[0] === variable) return pair[1]
				}
			}
			catch(err) {
				return undefined
			}
		}
		return undefined
	}
	/**
	 * 生成指定长度的随机字符串
	 * @param {Number} len 字符串长度，默认长度32
	 * @returns 随机字符串
	 */
	this.getNonce = function (len = 32) {
		const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678', // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
					maxPos = $chars.length;
		let str = '';
		for (var i = 0; i < len; i++) str += $chars.charAt(Math.floor(Math.random() * maxPos));
		return str;
	}
	/**
	 * md5加密
	 */
	this.md5 = function (str) {
		return cryptoJs().MD5(str).toString().toLowerCase();
	}
	/**
	 * 获取浏览器指纹
	 */
	this.getFingerPrint = function () {}
}

export default function(importModule) {
	const util = new utilCls(this.context)
	importModule.call(util,'cookie', cookie, this.constant)
	importModule.call(util,'cryptoJs', cryptoJs)
	importModule.call(util,'base64', base64)
	importModule.call(util,'axiosProxy', axiosProxy)
	importModule.call(util,'fingerprint', fingerprint)
	return util
}