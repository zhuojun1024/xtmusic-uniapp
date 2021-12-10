const getters = {
  userInfo: state => state.app.userInfo,
  currentMusic: state => state.playControl.currentMusic,
  currentMusicList: state => state.playControl.currentMusicList,
  currentTime: state => state.playControl.currentTime,
  duration: state => state.playControl.duration,
  paused: state => state.playControl.paused,
  bam: state => state.playControl.bam,
  windowTop: state => state.app.windowTop,
  windowBottom: state => state.app.windowBottom
}

export default getters
