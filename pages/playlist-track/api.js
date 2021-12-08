const request = require('../../request/index.js')

const apis = {
  // 获取歌单曲目
  getPlayListTrack: data => request('/playlist/track/all', 'post', { limit: 100, ...data })
}

module.exports = apis
