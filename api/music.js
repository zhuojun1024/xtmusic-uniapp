import store from '@/store/index.js'
import request from '@/request'

const music = {
  // 获取播放地址
  getMusicUrl: data => request('/song/url', 'post', { br: store.getters.toneQuality, ...data }),
  // 搜索歌曲列表
  cloudSearch: data => request('/cloudsearch', 'post', data),
  // 获取用户歌单
  getPlayList: data => request('/user/playlist', 'post', data),
  // 对歌单添加或删除歌曲
  updatePlayListTracks: data => request('/playlist/tracks', 'post', data),
  // 获取用户喜欢的音乐id列表
  getLikeList: data => request('/likelist', 'post', data)
}

export default music
