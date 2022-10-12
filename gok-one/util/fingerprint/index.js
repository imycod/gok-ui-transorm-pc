/**
 * 生成canvas浏览器指纹
 */
const fingerprintCls = function(constant, util) {
  this.bin2hex = function (s) {
    let i = 0, l = 0, o = '', n = '';
    s += '';
    for (i = 0, l = s.length; i < l; i++) {
      n = s.charCodeAt(i).toString(16);
      o += n.length < 2 ? '0' + n : n;
    }
    return o;
  }

  this.getUUID = function (domain) {
    const canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d'),
          txt = domain;
    let b64 = '',
        bin = '',
        crc = '';
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = 'tencent';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText(txt, 4, 17);
    b64 = canvas.toDataURL().replace('data:image/png;base64,', '');
    bin = atob(b64);
    crc = this.bin2hex(bin.slice(-16, -12));
    return crc;
  }
}
export default function (constant, util) {
  return new fingerprintCls(constant, util)
}