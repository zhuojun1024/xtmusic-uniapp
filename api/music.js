import request from '@/request'

const music = {
  // 获取播放地址
  getMusicUrl: data => request('/song/url', 'post', data)
}

export default music
