// @ts-ignore
import oneBuilder from 'gok-one'

const storeKey = {
    token: import.meta.env.VITE_APP_TOKEN_NAME,
    mackey: import.meta.env.VITE_APP_MACKEY_NAME,
    tenant: import.meta.env.VITE_APP_TENANT_NAME
}

const domain = {
    apiDomain: import.meta.env.VITE_APP_BASE_URL,
    ucDomain: import.meta.env.VITE_APP_LOGIN_URL,
    cookieDomain: import.meta.env.VITE_APP_COOKIE_DOMAIN
}

let one:any = {};
const httpResponseErr = function (err:any) {
    const errData = err.response;
    // 异常信息提交
    one.errCatch.api.catchInfo(errData);
    // 鉴权过期处理
    // 401 状态中的40100/40101 gok-one中已有默认处理
    switch (errData.status) {
        case 401:
            break;
        case 403:
        // Message.error('暂无权限访问,请联系管理员！');
        case 400:
            switch (errData.data.code) {
                case 999999:
                // if(route.path !== '/404')
                //   Router.replace('/404')
            }
        default:
        // Message.error(errData.data.message);
    }
}


one = oneBuilder.version(import.meta.env.VITE_APP_VERSION)
    .setMockMode(import.meta.env.VITE_APP_MOCK) // 传的话就是移除baseUrl
    .env(oneBuilder.mode[import.meta.env.VITE_APP_GOKENV])
    .setDomain(domain)
    .setTokenKey(storeKey)
    .setHttpResponseErr(httpResponseErr)
    .build()

export default one;
