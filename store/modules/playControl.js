import api from '@/api/music.js'
import {
  SET_CURRENT_MUSIC,
  SET_CURRENT_MUSIC_LIST,
  SET_CURRENT_TIME,
  SET_DURATION,
  SET_PAUSED,
  PLAY_PAUSE,
  PLAY_NEXT,
  PLAY_PREV,
  TIME_UPDATE,
  RESET_STATE
} from '../mutations-types.js'
const app = {
  state: {
    // #ifdef H5
    bam: uni.createInnerAudioContext(),
    // #endif
    // #ifndef H5
    bam: uni.getBackgroundAudioManager(),
    // #endif
    currentTime: 0,
    duration: 0,
    paused: true,
    currentMusic: {},
    currentMusicList: []
  },
  mutations: {
    [RESET_STATE]: state => {
      state.bam.stop()
      state.duration = 0
      state.currentTime = 0
      state.currentMusic = {}
      state.currentMusicList = []
    },
    // 设置当前播放音乐
    [SET_CURRENT_MUSIC]: (state, value) => {
      state.currentMusic = value
    },
    // 设置当前播放列表
    [SET_CURRENT_MUSIC_LIST]: (state, value) => {
      state.currentMusicList = value
    },
    // 设置当前播放进度（秒）
    [TIME_UPDATE]: (state, value) => {
      state.currentTime = value
    },
    // 设置音乐时长（秒）
    [SET_DURATION]: (state, value) => {
      state.duration = value
    },
    // 设置播放状态
    [SET_PAUSED]: (state, value) => {
      state.paused = value
    },
    // 播放/暂停
    [PLAY_PAUSE]: state => {
      const { bam, currentMusic } = state
      if (currentMusic.id) {
        bam.paused ? bam.play() : bam.pause()
      }
    },
    [SET_CURRENT_TIME]: (state, value) => {
      state.bam.seek(value)
    }
  },
  actions: {
    [SET_CURRENT_MUSIC] ({ commit, state }, currentMusic) {
      const id = currentMusic.id
      if (id === state.currentMusic.id) return
      const params = { id, timestamp: id }
      uni.showLoading({ title: '获取播放地址' })
      return api.getMusicUrl(params).then(res => {
        if (res.data && res.data.length) {
          const url = res.data[0].url
          const bam = state.bam
          // #ifndef H5
          const { name, ar, al } = currentMusic
          bam.title = name
          bam.singer = ar
          bam.coverImgUrl = al.picUrl
          // #endif
          bam.src = url
          bam.play()
          commit(SET_CURRENT_MUSIC, currentMusic)
        }
      }).catch(e => {
        uni.showToast({
          icon: 'error',
          title: '播放失败：' + e
        })
        console.log('播放失败：', e)
        return Promise.reject(e)
      }).finally(() => {
        uni.hideLoading()
      })
    },
    // 播放下一首
    [PLAY_NEXT] ({ dispatch, commit, state }) {
      const { currentMusic, currentMusicList } = state
      if (currentMusic.id) {
        const index = currentMusicList.findIndex(item => item.id === currentMusic.id)
        if (index < currentMusicList.length - 1) {
          const nextMusic = currentMusicList[index + 1]
          // 如果有版权则播放否则继续跳到下一首
          if (nextMusic.st !== -200) {
            return dispatch(SET_CURRENT_MUSIC, nextMusic)
          } else {
            commit(SET_CURRENT_MUSIC, nextMusic)
            return dispatch(PLAY_NEXT, nextMusic)
          }
        }
      }
    },
    // 播放上一首
    [PLAY_PREV] ({ dispatch, commit, state }) {
      const { currentMusic, currentMusicList } = state
      if (currentMusic.id) {
        const index = currentMusicList.findIndex(item => item.id === currentMusic.id)
        if (index > 0) {
          const lastMusic = currentMusicList[index - 1]
          // 如果有版权则播放否则继续跳到上一首
          if (lastMusic.st !== -200) {
            return dispatch(SET_CURRENT_MUSIC, lastMusic)
          } else {
            commit(SET_CURRENT_MUSIC, lastMusic)
            return dispatch(PLAY_PREV, lastMusic)
          }
        }
      }
    }
  }
}

export default app
