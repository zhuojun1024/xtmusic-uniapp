import request from '@/request'

const apis = {
  // 获取云盘数据
  getUserCloud: data => request('/user/cloud', 'post', data)
}

export default apis
