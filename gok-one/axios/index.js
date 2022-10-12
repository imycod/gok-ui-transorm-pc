/**
 * axios 代理
 * 设置请求头，刷新token等
 */

/**
 * default instance
 */
export default function() {
	return new this.util.axiosProxy({})
}