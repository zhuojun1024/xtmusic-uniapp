<template>
  <view class="lyric-wrapper">
    <view
      class="lyric-bg"
      :style="{ backgroundImage: `url(${picUrl})` }"
    />
    <scroll-view
      scroll-y
      scroll-with-animation
      class="lyric"
      :style="{ height: `calc(100vh - ${excludeHeight}px)` }"
      :scroll-top="scrollTop"
    >
      <view class="lyric-placeholder" />
      <view v-if="lyrics.length === 0" class="current">暂无歌词</view>
      <view
        v-else
        v-for="(item, index) of lyrics"
        :key="index"
        :class="{ 'lyric-item': true, current: index === currentLrcIndex }"
      >
        {{ item.text }}
      </view>
      <view class="lyric-placeholder" />
    </scroll-view>
  </view>
</template>

<script>
  import api from './api'
  export default {
    data() {
      return {
        lyrics: [],
        currentLrcIndex: 0,
        scrollTop: 0
      }
    },
    computed: {
      currentMusic () {
        return this.$store.getters.currentMusic
      },
      picUrl () {
        const al = this.currentMusic.al || {}
        return al.picUrl ? `${al.picUrl}?param=512y512` : ''
      },
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      }
    },
    watch: {
      currentMusic (newVal) {
        if (newVal.id) {
          this.getLyric()
          uni.setNavigationBarTitle({ title: newVal.name })
        }
      },
      '$store.getters.currentTime' (newVal) {
        this.playLrc(newVal * 1000)
      }
    },
    onLoad () {
      if (this.currentMusic.id) {
        this.getLyric()
        uni.setNavigationBarTitle({ title: this.currentMusic.name })
        // 屏幕常亮
        uni.setKeepScreenOn({ keepScreenOn: true })
      }
    },
    onUnload () {
      // 取消屏幕常亮
      uni.setKeepScreenOn({ keepScreenOn: false })
    },
    methods: {
      playLrc (time) {
        if (this.lyrics.length === 0) return
        // 如果时长超过歌词时长，取最后一句歌词
        if (time > this.lyrics[this.lyrics.length - 1].time) {
          this.currentLrcIndex = this.lyrics.length - 1
          this.scrollTop = this.currentLrcIndex * 48
          return
        }
        // 取当前歌词
        const index = this.lyrics.findIndex(item => item.time >= time)
        if (index !== this.currentLrcIndex) {
          this.currentLrcIndex = index - 1
          this.scrollTop = this.currentLrcIndex * 48
        }
      },
      getLyric () {
        this.lyrics = []
        const timestamp = new Date().getTime()
        const params = { id: this.currentMusic.id, timestamp }
        api.getLyric(params).then(res => {
          this.currentLrcIndex = 0
          this.scrollTop = 0
          this.lyrics = this.handleLyric((res.lrc || {}).lyric || '')
          // 播放歌词
          this.$nextTick(() => {
            const currentTime = this.$store.getters.currentTime
            this.playLrc(currentTime * 1000)
          })
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '获取歌词失败：' + e
          })
          console.error('获取歌词失败：', e)
        })
      },
      // 处理歌词
      handleLyric (lyric) {
        if (!lyric) return []
        const res = []
        const arr = lyric.split('\n').filter(item => item)
        for (const str of arr) {
          const timeStr = str.split(']')[0]
          const lrc = str.split(']')[1].trim()
          if (lrc) {
            const m = parseInt(timeStr.substr(1, 2))
            const s = parseInt(timeStr.substr(4, 2))
            const ms = parseInt(timeStr.substr(7, 2))
            const time = (m * 60 + s) * 1000 + ms
            res.push({ time, text: lrc })
          }
        }
        return res
      }
    }
  }
</script>

<style lang="scss" scoped>
.lyric-wrapper {
  background-color: #333333;
  position: relative;
  .lyric-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0.4;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    filter: blur(25px);
  }
  .lyric {
    padding: 0 24px;
    position: relative;
    top: 0;
    left: 0;
    z-index: 2;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    .lyric-item {
      height: 48px;
      // padding: 12px 0;
      font-size: 16px;
      &.current {
        color: white;
        font-size: 20px;
        // transition: font-size .2s;
      }
    }
    .lyric-placeholder {
      height: 40vh;
      &:last-child {
        height: 50vh;
      }
    }
    &:after {
      content: '';
      width: inherit;
      height: inherit;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
}
</style>
