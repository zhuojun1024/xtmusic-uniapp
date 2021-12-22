import request from '@/request'

const apis = {
  // 获取VIP信息
  getVipInfo: data => request('/vip/info', 'post', data)
}

export default apis
