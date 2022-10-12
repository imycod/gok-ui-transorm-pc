/**
 * 用户中心api
 * @param {object} http axios
 * @param {object} api url常量
 */
const SDK_INFO = require('../../package.json'),
      UNI_LOG_BASE_KEY = 'logBaseKey';
export const apiCls = function(context, constant, util, uc) {
  const DAU_LOCAL_NAME = context.env + '-gok-dau',
        USERBASE = uc.token.getUserBaseInfo() || {},
        TENANTINFO = uc.token.getCurTenant() || {},
        TODAY_DATE = new Date(),
        TODAY_TEXT = `${TODAY_DATE.getFullYear()}-${TODAY_DATE.getMonth() + 1}-${TODAY_DATE.getDate()}-${USERBASE.uid}`;
  let logApi = {
    tracking: '/logs/v1/tracking', // 日志采集结果查询
    getTracking: '/logs/v1/tracking', // 日志采集
    dau: '/logs/v1/tracking/user-active' // 日活埋点
  };

  // 默认参数
  let defaultData = {
    mid: 'mid', //设备id、浏览器指纹
    l: 'l', // 系统语言
    ar: '', // 区域
    md: '', // 手机型号
    ba: '', // 手机品牌
    sv: SDK_INFO.version, // sdk版本
    st: 'js', // sdk类型
    hw: '0*0', // 屏幕宽高
    nw: '', // 网络模式
    ln: 0, // 经度
    la: 0, // 维度
    t: (new Date()).getTime(), // 客户端日志上报的毫秒级时间戳
    nonce: util.getNonce(20) //每次上报请求的随机数，不超过20位
  }

  this.getUniLogBase = function () {
    if (context.isUniApp) {
      const logBaseInfo = uni.getStorageSync(UNI_LOG_BASE_KEY);
      if(!logBaseInfo) return undefined;
      try {
        return JSON.parse(logBaseInfo);
      }
      catch (err) {
        return undefined
      }
    } else {
      return undefined
    }
  }

  this.removeUniLogBase = function () {
    if (context.isUniApp) uni.removeStorageSync(UNI_LOG_BASE_KEY);
  }

  if (context.isBrowser) {
    defaultData.mid = util.fingerprint.getUUID();
    defaultData.l = navigator.language; // 系统语言
    defaultData.hw = `${window.screen.width}x${window.screen.height}`;
    // 隐藏变量，查看浏览器指纹
    if (window.location.href.indexOf('fingerprint=show') > -1) {
      console.log(`fingerprint= ${util.fingerprint.getUUID()}`);
    }
  } else {
    if (context.isUniApp) {
      const localInfo = this.getUniLogBase();
      if (localInfo) {
        defaultData.mid = localInfo.mid;
        defaultData.l = localInfo.language;
        defaultData.md = localInfo.md;
        defaultData.ba = localInfo.ba;
        defaultData.nw = localInfo.nw;
        defaultData.hw = localInfo.hw;
      }
    }
  }

  this.setUniLogBase = function (data) {
    if (context.isUniApp) uni.setStorageSync(UNI_LOG_BASE_KEY, JSON.stringify(data));
  }

  /**
   * 埋点数据提交
   */
  this.tracking = function (data) {
    Object.assign(defaultData, data);
    return new Promise((resolve, reject) => {
      uc.http.post(logApi.tracking, { data: defaultData }).then(res => {
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

  /**
   * 查看埋点信息
   */
  this.getTrackingInfo = function (params) {
    return new Promise((resolve, reject) => {
      uc.http.get(logApi.getTracking, { params }).then(res => {
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
  /**
   * 验证日活埋点
   */
  this.dauCheck = function () {
    let doDau = true;
    if (uc.local.localStorage.getItem(DAU_LOCAL_NAME) === TODAY_TEXT) doDau = false;
    return doDau
  }
  /**
   * 日活埋点
   */
  this.dau = function (data) {
    if (!USERBASE.uid) return
    if (!TENANTINFO.tenantId) return
    defaultData.uid = USERBASE.uid;
    defaultData.memberId = TENANTINFO.memberId;
    defaultData.memberName = TENANTINFO.memberName;
    defaultData.tenantId = TENANTINFO.tenantId;
    Object.assign(defaultData, data);
    return new Promise((resolve, reject) => {
      uc.http.post(logApi.dau, { data: defaultData }).then(res => {
        uc.local.localStorage.setItem(DAU_LOCAL_NAME, TODAY_TEXT);
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
  this.setDau = function () {
    if (this.dauCheck()) this.dau()
  }

}
// export
export default function(context, constant, util, uc) {
  return new apiCls(context, constant, util, uc)
}