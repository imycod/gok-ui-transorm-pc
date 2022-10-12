import cryptoJs from 'crypto-js'
/**
 * base64加解密相关
 */
const base64Cls = function() {
  /**
   * base64加密
   */
  this.encrypt = function(value) {
		const base64Str = cryptoJs.enc.Base64.stringify(cryptoJs.enc.Utf8.parse(value)).replace (/=/g,'');
    return base64Str;
  }

  /**
   * base64解密
   */
  this.parse = function (value) {
    if (!value) { return false }
    const fillNum = (4 - value.length % 4 );
    // 构建完整的base64字符串，字符串长度不是4的倍数的话末尾用【=】填充
    fillNum && (value += '==='.substring(0, fillNum));
    return (cryptoJs.enc.Base64.parse(value)).toString(cryptoJs.enc.Utf8);
  }

}

export default function() {
  return new base64Cls();
}
