import request from '@/request'

const login = {
  // 登录
  loginCellPhone: data => request('/login/cellphone', 'post', data),
  // 获取登录用户信息
  getAccountInfo: data => request('/user/account', 'post', data),
  // 注销登录
  logout: data => request('/logout', 'post', data)
}

export default login
