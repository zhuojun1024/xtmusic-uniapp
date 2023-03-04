const request = require('@/request/index.js')

const apis = {
  // 获取验证码
  sendCaptcha: data => request('/captcha/sent', 'post', data),
  // 游客登录
  registerAnonimous: data => request('/register/anonimous', 'post', data)
}

module.exports = apis
