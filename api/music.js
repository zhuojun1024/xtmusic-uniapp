import request from '@/request'

const music = {
  // 获取播放地址
  getMusicUrl: data => request('/song/url', 'post', data),
  // 搜索歌曲列表
  cloudSearch: data => request('/cloudsearch', 'post', data)
}

export default music
