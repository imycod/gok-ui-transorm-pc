import MD5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import HmacSHA256 from 'crypto-js/hmac-sha256'
import EncUtf8 from 'crypto-js/enc-utf8'
import AES from 'crypto-js/aes'
import ECB from 'crypto-js/mode-ecb'
import Nopadding from 'crypto-js/pad-nopadding'
import Pkcs7 from 'crypto-js/pad-pkcs7'
import Zeropadding from 'crypto-js/pad-zeropadding'

/**
 *  由于 crypto-js 包过大，保持原有结构
 *  加密相关,按需封装
 */
const CryptoJS = {}

/**
 *  md5
 */
CryptoJS.MD5 = value => {
  return MD5(value)
}
CryptoJS.AES = AES

CryptoJS.enc = {}
CryptoJS.mode = {}
CryptoJS.pad = {}

CryptoJS.mode.ECB = ECB
CryptoJS.pad.Nopadding = Nopadding
CryptoJS.pad.Pkcs7 = Pkcs7
CryptoJS.pad.Zeropadding = Zeropadding

CryptoJS.enc.Utf8 = EncUtf8

CryptoJS.enc.Base64 = {}

CryptoJS.enc.Base64.stringify = value => {
  return Base64.stringify(value)
} 

CryptoJS.enc.Base64.format = value => {
  const base64Str = Base64.stringify(value)
  // 将base64转码后的结果中的相应字符串进行替换【+ > -】【/ > _】，并且删除末尾补位的【=】
  return base64Str.replace(/=/g,'').replace (/\+/g,'-').replace( /\//g,'_' )
}

CryptoJS.enc.Base64.parse = value => {
  return Base64.parse(value)    
}

CryptoJS.HmacSHA256 = (content,key) => {
  return HmacSHA256(content,key)
}

export default function() {
  return CryptoJS
}

