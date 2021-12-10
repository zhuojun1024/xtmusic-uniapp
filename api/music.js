import request from '@/request'

const music = {
  // 获取播放地址，限制192kbps码率
  getMusicUrl: data => request('/song/url', 'post', { br: 192000, ...data }),
  // 搜索歌曲列表
  cloudSearch: data => request('/cloudsearch', 'post', data),
  // 获取用户歌单
  getPlayList: data => request('/user/playlist', 'post', data),
  // 对歌单添加或删除歌曲
  updatePlayListTracks: data => request('/playlist/tracks', 'post', data)
}

export default music
