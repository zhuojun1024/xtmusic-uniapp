const request = require('@/request/index.js')

const apis = {
  // 获取验证码
  sendCaptcha: data => request('/captcha/sent', 'post', data)
}

module.exports = apis
