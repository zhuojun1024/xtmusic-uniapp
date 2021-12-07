import {
  SET_BAM,
  SET_CURRENT_MUSIC,
  SET_CURRENT_MUSIC_LIST,
  SET_CURRENT_TIME,
  SET_DURATION,
  SET_PAUSED,
  PLAY_PAUSE,
  PLAY_NEXT,
  PLAY_PREV
} from '../mutations-types.js'
const app = {
  state: {
    bam: undefined,
    currentTime: 0,
    duration: 0,
    paused: true,
    currentMusic: {},
    currentMusicList: []
  },
  mutations: {
    // 设置背景音乐管理对象
    [SET_BAM]: (state, value) => {
      state.bam = value
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
    [SET_CURRENT_TIME]: (state, value) => {
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
    // 播放下一首
    [PLAY_NEXT]: state => {
      const { currentMusic, currentMusicList } = state
      if (currentMusic.id) {
        const index = currentMusicList.findIndex(item => item.id === currentMusic.id)
        if (index < currentMusicList.length - 1) {
          state.commit(SET_CURRENT_MUSIC, currentMusicList[index + 1])
        }
      }
    },
    // 播放上一首
    [PLAY_PREV]: state => {
      const { currentMusic, currentMusicList } = state
      if (currentMusic.id) {
        const index = currentMusicList.findIndex(item => item.id === currentMusic.id)
        if (index > 0) {
          state.commit(SET_CURRENT_MUSIC, currentMusicList[index - 1])
        }
      }
    }
  }
}

export default app
