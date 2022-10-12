import type { MockMethod  } from 'vite-plugin-mock'

export default [
    {
        url: "/api/yujing/sisetu",
        method: "get",
        response: () => {
            return {
                code: 0,
                message: "ok",
                'data|12': [{
                    warnBl: 0,// 预警占比
                    'warnLevel|0-3': 0,// 预警等级
                    'warnNum|0-100': 0,// 预警数量
                    'warnTotal|0-100': 0,// 报警数量
                }]
            }
        }
    }
] as MockMethod[] // 这里其实就是定义数据格式的，不了解的同学可以参考typescript的官方文档
