/**
 * axios 代理
 * 设置请求头，刷新token等
 */
import axios from 'axios'

/**
 * 验证url最后一个字符串是不是&，如果是就删除
 * @param {String} url  - 需要验证的url
 */
const urlCheck = function (url) {
    const urlLen = url.length;
    return url[urlLen - 1] === '&' ? url = url.substr(0, urlLen - 1) : url; // 如果最后一个字符串是&则删除最后一个字符串
}

/**
 * 格式化url，如果存在拼接的参数则截断，和params参数合并
 * @params {String} url - 请求路径
 * @params {Object} params - 请求参数
 * @return {String} 格式化以后的url
 */
const urlFormat = function (url, params = {}) {
    for (let key in params) { // 将对象参数的值转换为数组形式（处理多个同名参数）
        params[key] = [params[key]]
    }
    url = urlCheck(url); // 验证url
    // 构造参数对象
    let index = url.indexOf('?'); // url携带参数的？的下标
    if (index !== -1) { // 如果url上有携带参数
      const newUrl = url.substr(index + 1); // 删除？获取参数的键值字符串
      url = url.substr(0, index + 1); // 基础url不携带参数带有？
      if (newUrl.includes('&')) { // 如果有携带有效参数则根据&进行分割
            newUrl.split('&').forEach(item => { // 遍历所有的有效参数
                if(item.indexOf('=') > 0) { // 对有效参数进行键值分离
                    const paramsArr = item.split('=');
                    params[paramsArr[0]] ? params[paramsArr[0]].push(paramsArr[1]) : params[paramsArr[0]] = [paramsArr[1]]; // 构造参数对象，值为数组（处理多个同名参数）
                }
            })
        }
    }
    // 构造新的url
    const keysArrSort = Object.keys(params).sort(); // 对参数对象属性进行sort排
    const keysArrSortLen = keysArrSort.length; // 参数数组长度
    if (keysArrSortLen && index === -1) { // 如果需要在路由上拼接参数，但是原始路由不带？则在路由末尾添加？
      url += '?';
    }
    for(let i = 0; i < keysArrSortLen; i++) { // 按参数对象属性key的sort顺序遍历参数对象
      if (params[keysArrSort[i]].length === 1) { // 不存在多个同名参数
        url += `${keysArrSort[i]}=${params[keysArrSort[i]]}&`; // 构造新的url
      } else if (params[keysArrSort[i]].length > 1) { // 存在多个同名参数
        params[keysArrSort[i]].sort(); // 对同名参数构建的数组进行sort排序
        for(let j = 0; j < params[keysArrSort[i]].length; j++) { // 构造新的url
          url += `${keysArrSort[i]}=${params[keysArrSort[i]][j]}&`;
        }
      }
    }
    return urlCheck(url); // 验证url
  }

var axiosProxyCls = function(axios_){
    this.axiosProxy_ = axios_
    this.axiosProxy_.defaults.timeout = 30000;
    this.axiosProxy_.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
        var config = err.config;
        // If config does not exist or the retry option is not set, reject
        if(!config || !config.retry) return Promise.reject(err);

        // Set the variable for keeping track of the retry count
        config.__retryCount = config.__retryCount || 0;

        // Check if we've maxed out the total number of retries
        if(config.__retryCount >= config.retry) {
            // Reject with the error
            return Promise.reject(err);
        }

        // Increase the retry count
        config.__retryCount += 1;

        // Create new promise to handle exponential backoff
        var backoff = new Promise(function(resolve) {
            setTimeout(function() {
                resolve();
            }, config.retryDelay || 1);
        });

        // Return the promise in which recalls axios to retry the request
        return backoff.then(function() {
            return axios(config);
        });
      });
}

//export axios.interceptors
axiosProxyCls.prototype.proxy = function() {
    return this.axiosProxy_
}

/**
 * get 请求
 * @param {string} url
 * @param {object} params
 */
axiosProxyCls.prototype.get = function(url,params) {
    url = urlFormat(url, params.params);
    let config = { method: 'GET', url: url}
    // config = Object.assign(config,params)
    return new Promise((r,j) => {
        this.axiosProxy_(config).then(res => {
            r (res)
        })
        .catch(err => {
            j (err)
        })
    })
}

/**
 *  post 请求
 * @param {string} url
 * @param {object} params
 */
axiosProxyCls.prototype.post = function(url,params) {
    let config = { method: 'POST', url: url }
    config = Object.assign(config,params)
    return new Promise((r,j) => {
        this.axiosProxy_(config).then(res => {
            r (res)
        })
        .catch(err => {
            j (err)
        })
    })
}

/**
 *  put 请求
 * @param {string} url
 * @param {object} params
 */
axiosProxyCls.prototype.put = function(url,params) {
    let config = { method: 'PUT', url: url }
    config = Object.assign(config,params)
    return new Promise((r,j) => {
        this.axiosProxy_(config).then(res => {
            r (res)
        })
        .catch(err => {
            j (err)
        })
    })
}


/**
 *  delete 请求
 * @param {string} url
 * @param {object} params
 */
axiosProxyCls.prototype.delete = function(url,params) {
    let config = { method: 'DELETE', url: url }
    config = Object.assign(config,params)
    return new Promise((r,j) => {
        this.axiosProxy_(config).then(res => {
            r (res)
        })
        .catch(err => {
            j (err)
        })
    })
}


/**
 *  请求
 * @param {string} url
 * @param {object} params
 */
axiosProxyCls.prototype.request = function(config = {}) {
    return new Promise((r,j) => {
        this.axiosProxy_(config).then(res => {
            r (res)
        })
        .catch(err => {
            j (err)
        })
    })
}

/**
 * default instance
 * 如果有axios实例传入，则使用默认axios
 */
const axiosProxy = function(config) {
    let axiosProxy
    if(config){
        axiosProxy = axios.create(config)
    }else {
        axiosProxy = axios
    }
    return new axiosProxyCls(axiosProxy)
}
export default function() {
    return axiosProxy
}
