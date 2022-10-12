import api from './api'

/**
 *  视频埋点模块
 */
const logCls = function(context, constant) {}

/**
 *  export
 */
export default function(importModule) {
	const log = new logCls(this.context, this.constant)
	importModule.call(log, 'api', api, this.context, this.constant, this.util, this.uc)
	return log
}
