
const LOCAL_KEYS = {
  diffTime: 'diff_time'
}
export const localCls = function (context, util) {
  this.localStorage = {
    /**
     * 设置本地存储
     * @param {String} key 缓存名称
     * @param {*} value 缓存值
     */
    setItem: function (key, value) {
      if (context.isBrowser) {
        window.localStorage.setItem(key, JSON.stringify(value))
      } else {
        if (context.isUniApp) uni.setStorageSync(key, JSON.stringify(value));
      }
    },
    /**
     * 获取指定缓存
     * @param {String} key 缓存名称
     */
    getItem: function (key) {
      if (context.isBrowser) {
        const content = window.localStorage.getItem(key);
        try {
          return content ? JSON.parse(content) : undefined;
        } catch (err) {
          console.log(err);
          return undefined
        }
      } else {
        if (context.isUniApp) {
          const content = uni.getStorageSync(key);
          try {
            return content ? JSON.parse(content) : undefined;
          } catch (err) {
            console.log(err);
            return undefined
          }
        }
        return undefined
      }
    },
    /**
     * 删除指定缓存
     * @param {String} key 缓存名称
     */
    removeItem: function (key) {
      if (context.isBrowser) {
        window.localStorage.removeItem(key)
      } else {
        if (context.isUniApp) uni.removeStorageSync(key);
      }
    }
  }
  /**
   * 存储本地时间和服务器时间的差值
   * @param {Number} value 时间差值
   */
  this.setDiffTime = function (res) {
    const header = res['header'] || res['headers'],
          timeValue = (new Date(header.date)).getTime() - (new Date).getTime();
    // 判断入参是否是整数，时间差只能是整数，毫秒级，如果时间差不为整数则不执行
    if (!timeValue) return
    if (parseInt(timeValue) !== parseFloat(timeValue)) return
    this.localStorage.setItem(LOCAL_KEYS.diffTime, timeValue);
  }
  /**
   * 获取存储本地时间和服务器时间的差值
   * @returns {Number} 时间差值
   */
  this.getDiffTime = function () {
    let time = this.localStorage.getItem(LOCAL_KEYS.diffTime);
    try {
      return time ? Number(time) : 0;
    } catch (err) {}
  }
}

export default function (context, util) {
  return new localCls(context, util)
}
