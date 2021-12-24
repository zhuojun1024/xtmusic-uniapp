const request = require('@/request/index.js')

const apis = {
  // 获取歌词
  getLyric: data => request('/lyric', 'post', data),
  // 喜欢/取消喜欢音乐
  updateLike: data => request('/like', 'post', data)
}

module.exports = apis
