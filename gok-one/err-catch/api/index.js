/**
 * 用户中心api
 * @param {object} http axios
 * @param {object} api url常量
 */
 const SDK_INFO = require('../../package.json');
export const apiCls = function(context, constant, util, uc) {
  let catchApi = {
    catchInfo: '/tc/error/infos', // 接口500报错信息采集
  };

  /**
   * 埋点数据提交
   */
  this.catchInfo = function (info) {
    const { config, data } = info;
    const user = uc.token.getUserBaseInfo();
    const tenant = uc.token.getCurTenant();
    const params = {
      uid: user && user.uid,
      tenantId: tenant && tenant.tenantId,
      version: SDK_INFO.version,
      method: config.method,
      uri: config.url,
      param: JSON.stringify(config.data),
      message: JSON.stringify(data)
    }
    return new Promise((resolve, reject) => {
      uc.http.post(catchApi.catchInfo, { data: params }).then(res => {
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
export default function(context, constant, util, uc) {
  return new apiCls(context, constant, util, uc)
}