<template>
  <view>
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
      }
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
          this.lyrics = this.handleLyric(res.lrc.lyric)
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
.lyric {
  box-sizing: border-box;
  color: #aaaaaa;
  text-align: center;
  background-color: #666666;
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
  }
  &:after {
    content: '';
    width: inherit;
    height: inherit;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
