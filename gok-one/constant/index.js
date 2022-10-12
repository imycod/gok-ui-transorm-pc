/**
 *  存储cookie的域名
 */
const cookieDomainDic = {
	dev: 'http://localhost:9002',
	test: 'https://test-edu.goktech.cn',
	prod: 'https://edu.goktech.cn'
}
/**
	*  接口访问域名
	*/
const apiDomainDic = {
	dev: 'https://testapi.goktech.cn',
	test: 'https://testapi.goktech.cn',
	prod: 'https://api.goktech.cn'
}

/**
	*  uc访问页面
	*/
const ucDomainDic = {
	dev: 'https://test-uc.goktech.cn',
	test: 'https://test-uc.goktech.cn',
	prod: 'https://uc.goktech.cn'
}

const tokenKey = {
	token: 'token',
	mackey: 'mackey'
}

/**
	*  常量
	* @param {object} context
	*/
const constant = function(context) {
	return {
		cookieDomain: context.domain.cookieDomain || cookieDomainDic[context.env],
		apiDomain: context.domain.apiDomain || apiDomainDic[context.env],
		ucDomain: context.domain.ucDomain || ucDomainDic[context.env],
		tokenKey
	}
}
/**
 * export
 */
export default function() {
		return new constant(this.context)
}