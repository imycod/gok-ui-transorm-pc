/**
 * 各个平台的响应头信息兼容处理
 * 注：主要正对小程序/APP的处理，IOS不同设备可能出现字母大小写问题
 */
const HEADER_KEY = {
  // 响应头中的x-token参数
  token: ['x-token', 'X-Token', 'x-Token', 'X-token'],
  // 响应头中的x-mackey参数
  mackey: ['x-mackey', 'X-Mackey', 'x-Mackey', 'X-mackey'],
  // 响应头中的x-code参数
  code: ['x-code', 'X-Code', 'x-Code', 'X-code']
},
  // token相关的存储关键字
  KEY_PREFIX = {
    dev: '_d_', // 开发环境
    test: '_', // 测试环境
    prod: '' // 正式环境
  },
	TENANT_ID_KEY = 't-id'

/**
 * 获取请求头中的header对象
 * @param {Object} res 请求头信息
 * @returns {Object} 请求头的header对象
 */
const getHttpHeader = function (res) {
  return res.header || res.headers;
}
/**
 * 根据key值获取响应头的对应信息
 * @param {Object} res 响应头
 * @param {String} key 字段值
 * @returns {Object}
 */
const getContentByKey = function (res, key) {
  res = getHttpHeader(res);
  let keyInfo = undefined;
  for (let i = 0; i < HEADER_KEY[key].length; i++) {
    if (res[HEADER_KEY[key][i]]) {
      keyInfo = res[HEADER_KEY[key][i]];
      break
    }
  }
  return keyInfo
}
/**
 * 获取响应头的x-token信息
 */
const getHttpXToken = function (res) {
  return getContentByKey(res, 'token');
}
/**
 * 获取响应头的x-mackey信息
 */
const getHttpXMackey = function (res) {
  return getContentByKey(res, 'mackey');
}

/**
 * token存储解析等操作
 * @param {object} context
 * @param {object} constant
 * @param {object} util
 */
export const tokenCls = function(context, constant, util, local) {
  // 合并token相关的本地存储字段的key值
  const mergerTokenKey = Object.assign(constant.tokenKey, context.tokenKey);
	this.TOKEN_NAME = KEY_PREFIX[context.env] + mergerTokenKey.token;
	this.MACKEY_NAME = KEY_PREFIX[context.env] + mergerTokenKey.mackey;
	this.TENANT_ID_NAME = KEY_PREFIX[context.env] + TENANT_ID_KEY;
	this.setTokenCallback

	this.setTokenDone = function (fn) {
		this.setTokenCallback = fn;
	}
  /**
   * 获取响应头中的x-code
   */
  this.getHeaderCode = function (res) {
    return getContentByKey(res, 'code');
  }
	/**
	 *  mackey
	 */
	this.getMackey = function () {
    if (context.isBrowser) return util.cookie.getCookie(this.MACKEY_NAME);
    if (context.isUniApp && !context.isBrowser) return local.localStorage.getItem(this.MACKEY_NAME);
    throw new Error('mackey获取失败');
	}

	/**
	 *  获取token
	 */
	this.getToken = function () {
    if (context.isBrowser) return util.cookie.getCookie(this.TOKEN_NAME);
    if (context.isUniApp && !context.isBrowser) return local.localStorage.getItem(this.TOKEN_NAME);
    throw new Error('token获取失败');
	}

	/**
	 * 存储mackey
	 */
	this.storeMackey = function (res) {
    const mackey = getHttpXMackey(res);
    if (!mackey) return
    if (context.isBrowser) {
      util.cookie.storeCookie(this.MACKEY_NAME, mackey);
      return
    }
    if (context.isUniApp && !context.isBrowser) {
      local.localStorage.setItem(this.MACKEY_NAME, mackey);
      return
    }
    throw new Error('mackey存储失败');
	}

	/**
	 * 存储token
	 */
	this.storeToken = function (res) {
    const token = getHttpXToken(res);
    if (!token) return
    if (context.isBrowser) {
      util.cookie.storeCookie(this.TOKEN_NAME, token);
			typeof this.setTokenCallback === 'function' && this.setTokenCallback(this.getUserBaseInfo());
      return
    }
    if (context.isUniApp && !context.isBrowser) {
      local.localStorage.setItem(this.TOKEN_NAME, token);
			typeof this.setTokenCallback === 'function' && this.setTokenCallback(this.getUserBaseInfo());
      return
    }
    throw new Error('token存储失败');
	}

	/**
	 * 删除mackey
	 */
	this.removeMackey = function () {
    if (context.isBrowser) {
      util.cookie.removeCookie(this.MACKEY_NAME);
      return
    }
    if (context.isUniApp && !context.isBrowser) {
      local.localStorage.removeItem(this.MACKEY_NAME);
      return
    }
    throw new Error('mackey删除失败');
	}

	/**
	 * 删除token
	 */
	this.removeToken = function () {
    if (context.isBrowser) {
      util.cookie.removeCookie(this.TOKEN_NAME);
      return
    }
    if (context.isUniApp && !context.isBrowser) {
      local.localStorage.removeItem(this.TOKEN_NAME);
      return
    }
    throw new Error('token删除失败');
	}

	/**
	 * token解析
	 */
	this.parseToken = function () {
		const token = this.getToken();
		if(token) {
			let userInfoStr = token.split('.')[1];
			// 非法的用户信息处理
			if (!userInfoStr) return undefined
			// 将base64url编码转换为base64编码，即【- > +】【_ > /】
			userInfoStr = userInfoStr.replace (/\-/g,'+').replace( /\_/g,'/' );
			return JSON.parse(util.base64.parse(userInfoStr));
		}
		return undefined
	}

	/**
	 * 获取用户的基本信息
	 * 不涉及租户及权限信息
	 * 注：对应版本版本V210
	 */
	this.getUserBaseInfo = function () {
		const userInfo = this.parseToken();
		if (userInfo) {
			return {
				admin: userInfo.admin,
				av: userInfo.av,
				firstLogin: userInfo.firstLogin,
				gKey: userInfo.gKey,
				nm: userInfo.nm,
				phone: userInfo.phone,
				uid: userInfo.uid,
				wn: userInfo.wn,
				wxId: userInfo.wxId
			}
		}
		return undefined
	}

	/**
	 * 获取当前用户的权限信息
	 * 注：对应版本版本V210
	 */
	this.getPermissions = function () {
		const userInfo = this.parseToken();
		if (userInfo) return userInfo.perms;
		return undefined
	}

	/**
	 * 获取当前租户信息
	 * 注：对应版本版本V210
	 */
	this.getCurTenant = function () {
		const userInfo = this.parseToken();
		if (userInfo) return userInfo.tenants[0];
		return undefined
	}

	/**
	 * 获取token的失效时间
	 * 注：对应版本版本V210
	 */
	this.getExp = function () {
		const userInfo = this.parseToken();
		if (userInfo) return userInfo.exp;
		return undefined
	}

	/**
	 * @date 2022-01-18
	 * @returns {Object}
	 * 注：对应版本版本V210
	 */
	this.parseTenant = function () {
		const userInfo = this.parseToken();
		return (userInfo.tenants && userInfo.tenants.length) ? userInfo.tenants[0] : undefined;
	}

	/**
	 * 判断token是否过期
	 */
	this.isTokenExp = function () {
		const userInfo = this.getUserBaseInfo();
		if (!userInfo) return false;
		let curTime = (new Date()).getTime(),
        loseTime = this.getExp();
    return (loseTime - curTime) < 0;
	}

	/**
	 * 设置本地租户ID
	 */
	this.setLocalTenantId = function (id) {
		local.localStorage.setItem(this.TENANT_ID_NAME, id || '');
	}
	/**
	 * 获取本地租户ID
	 * 注：退出登录后不清除，为上次登录使用的租户ID
	 */
	this.getLocalTenantId = function () {
		return local.localStorage.getItem(this.TENANT_ID_NAME) || undefined;
	}
	/**
	 * 删除本地租户ID
	 */
	this.removeLocalTenantId = function () {
		local.localStorage.removeItem(this.TENANT_ID_NAME);
	}
}

export default function(context, constant, util) {
	return new tokenCls(context, constant, util, this.local);
}