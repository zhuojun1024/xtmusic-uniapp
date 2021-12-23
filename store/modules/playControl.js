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
  RESET_STATE,
  SET_TONE_QUALITY,
  SET_PLAY_MODE,
  PLAY_MODE_SEQUE,
  PLAY_MODE_REPEAT_ONE,
  PLAY_MODE_SHUFFLE,
  ON_ENDED
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
    currentMusicList: [],
    shuffleMusicList: [],
    toneQuality: 128000,
    playMode: PLAY_MODE_SEQUE
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
      // 如果是随机播放模式，生成随机列表
      if (state.playMode === PLAY_MODE_SHUFFLE) {
        const playList = JSON.parse(JSON.stringify(state.currentMusicList))
        state.shuffleMusicList = playList.sort(() => {
          return 0.5 - Math.random()
        })
      }
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
      state.currentTime = value
    },
    [SET_TONE_QUALITY]: (state, value) => {
      state.toneQuality = value
      uni.setStorageSync('toneQuality', value)
    },
    [SET_PLAY_MODE]: (state, value) => {
      state.playMode = value
      uni.setStorageSync('playMode', value)
      // 如果是随机播放模式，生成随机列表
      if (state.playMode === PLAY_MODE_SHUFFLE) {
        const playList = JSON.parse(JSON.stringify(state.currentMusicList))
        state.shuffleMusicList = playList.sort(() => {
          return 0.5 - Math.random()
        })
      }
    }
  },
  actions: {
    [SET_CURRENT_MUSIC] ({ commit, state }, currentMusic) {
      const id = currentMusic.id
      if (id === state.currentMusic.id && state.playMode !== PLAY_MODE_REPEAT_ONE) return
      const params = { id, timestamp: id }
      uni.showLoading({ title: '获取播放地址' })
      return api.getMusicUrl(params).then(res => {
        if (res.data && res.data.length) {
          const url = res.data[0].url
          if (!url) {
            uni.showToast({
              icon: 'error',
              title: '该音乐无版权'
            })
            return
          }
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
      const { currentMusic, currentMusicList, shuffleMusicList, playMode } = state
      // 判断是否随机播放模式，是的话使用随机列表
      const musicList = playMode === PLAY_MODE_SHUFFLE ? shuffleMusicList : currentMusicList
      if (currentMusic.id) {
        const index = musicList.findIndex(item => item.id === currentMusic.id)
        let nextMusic
        // 是否还有下一首，没有取第一首
        if (index < musicList.length - 1) {
          nextMusic = musicList[index + 1]
        } else {
          nextMusic = musicList[0]
        }
        // 如果有版权则播放否则继续跳到下一首
        if (nextMusic.st !== -200) {
          return dispatch(SET_CURRENT_MUSIC, nextMusic)
        } else {
          commit(SET_CURRENT_MUSIC, nextMusic)
          return dispatch(PLAY_NEXT, nextMusic)
        }
      }
    },
    // 播放上一首
    [PLAY_PREV] ({ dispatch, commit, state }) {
      const { currentMusic, currentMusicList, shuffleMusicList, playMode } = state
      // 判断是否随机播放模式，是的话使用随机列表
      const musicList = playMode === PLAY_MODE_SHUFFLE ? shuffleMusicList : currentMusicList
      if (currentMusic.id) {
        const index = musicList.findIndex(item => item.id === currentMusic.id)
        let lastMusic
        // 是否还有上一首，没有取最后一首
        if (index > 0) {
          lastMusic = musicList[index - 1]
        } else {
          lastMusic = musicList[musicList.length - 1]
        }
        // 如果有版权则播放否则继续跳到上一首
        if (lastMusic.st !== -200) {
          return dispatch(SET_CURRENT_MUSIC, lastMusic)
        } else {
          commit(SET_CURRENT_MUSIC, lastMusic)
          return dispatch(PLAY_PREV, lastMusic)
        }
      }
    },
    // 播放结束
    [ON_ENDED] ({ dispatch, state }) {
      // 是否为单曲循环模式
      if (state.playMode === PLAY_MODE_REPEAT_ONE) {
        return dispatch(SET_CURRENT_MUSIC, state.currentMusic)
      } else {
        return dispatch(PLAY_NEXT)
      }
    }
  }
}

export default app
