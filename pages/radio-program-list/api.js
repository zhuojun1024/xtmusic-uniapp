import request from '@/request'

const apis = {
  // 获取电台节目
  getRadioProgram: data => request('/dj/program', 'post', data)
}

export default apis
