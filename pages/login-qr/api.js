const request = require('@/request/index.js')

const apis = {
  // 获取二维码key
  getQrKey: data => request('/login/qr/key', 'post', data),
  // 获取二维码图片
  getQrImg: data => request('/login/qr/create', 'post', data),
  // 检测二维码状态
  getQrStatus: data => request('/login/qr/check', 'post', data)
}

module.exports = apis
