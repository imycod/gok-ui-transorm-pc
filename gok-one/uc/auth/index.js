/**
 * uc 签名相关
 * @param {object} context
 */
const auth = function(context, constant, util) {
  // 生成macKey
  const createMacKey = function (nonce, timestamp) {
    const res_256 = util.cryptoJs.HmacSHA256(nonce, timestamp);
    return util.cryptoJs.enc.Base64.format(res_256);
  }

  /**
  * 对路由进行重构，如果存在数组类参数只取字典排序后的第一个数据元素进行签名加密
  * @param {String} url
  */
  const createNewUrl = function (url) {
    let index = url.indexOf("?");
    if (index !== -1) {
      let params = {};
      const paramsUrl = url.substr(index + 1);
      let newUrl = url.split('?')[0];
      if (paramsUrl.includes('&')) {
        newUrl = newUrl + '?';
        const urlArr = paramsUrl.split('&');
        urlArr.forEach(item => {
          const paramsIndex = item.indexOf('=');
          if(paramsIndex > 0) {
            const paramsArr = item.split('=');
            if (params.hasOwnProperty(paramsArr[0])){
              const tempArr = params[paramsArr[0]];
              tempArr.push(paramsArr[1]);
              params[paramsArr[0]] = tempArr.sort();
            } else {
              params[paramsArr[0]] = [paramsArr[1]];
            }
          }
        })
        for(let key in params) {
          newUrl = `${newUrl}${key}=${params[key][0]}&`;
        }
        newUrl = newUrl.substring(0, newUrl.lastIndexOf('&'));
      } else {
        newUrl = url;
      }
      return newUrl;
    } else {
      return url;
    }
  }

  // 计算auth值
  const computeAuth = function (methodType, url) {
    let xmacKey = this.token.getMackey(),
        xtoken = this.token.getToken(),
        auth = '',
        host = constant.apiDomain,
        uri = createNewUrl(url);
    const method = methodType.toUpperCase(),
          nonce = util.getNonce(),
          timestamp = (new Date).getTime() + this.local.getDiffTime() + '';
    if (host[host.length - 1] === '/') host = host.substr(0, host.length - 1);
    if ( host.indexOf('https://') !== -1 ) host = host.replace('https://', '');
    if (host.indexOf('http://') !== -1) host = host.replace('http://', '');
    const conent = method + '\n' + host + '\n' + uri + '\n' + nonce + '\n' + timestamp,
          macKey = (typeof(xmacKey) == 'string') ? xmacKey : createMacKey(nonce, timestamp),
          mac = util.cryptoJs.enc.Base64.format(util.cryptoJs.HmacSHA256(conent, macKey)),
          token = xtoken || '';
    auth = `MAC token="${token}",nonce="${nonce}",timestamp="${timestamp}",mac="${mac}"`;
    // 添加鉴权信息输出
    if (context.isBrowser && (window.location.href.indexOf('auth=show') > -1)){
      console.log('===== AUTH START =====');
      console.log(`method= ${method}`);
      console.log(`uri= ${uri}`);
      console.log(`host= ${host}`);
      console.log(`nonce= ${nonce}`);
      console.log(`timestamp= ${timestamp}`);
      console.log('===== AUTH END =====');
    }
    return auth;
  }
  return computeAuth
}

export default function(context, constant, util) {
  return new auth(context, constant, util)
}