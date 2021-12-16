<template>
  <view class="lyric-wrapper">
    <scroll-view
      scroll-y
      scroll-with-animation
      class="lyric"
      :style="{ height }"
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
  import api from '../api'
  export default {
    props: {
      height: {
        type: String,
        default: '100vh'
      }
    },
    data() {
      return {
        lyrics: [],
        heights: [],
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
        }
      },
      '$store.getters.currentTime' (newVal) {
        this.playLrc(newVal * 1000)
      }
    },
    mounted () {
      if (this.currentMusic.id) {
        this.getLyric()
        // 屏幕常亮
        uni.setKeepScreenOn({ keepScreenOn: true })
      }
    },
    destroyed () {
      // 取消屏幕常亮
      uni.setKeepScreenOn({ keepScreenOn: false })
    },
    methods: {
      getAllNodeHeight () {
        const query = uni.createSelectorQuery().in(this)
        query.selectAll('.lyric-item').boundingClientRect(data => {
          // 保存所有歌词scrollTop
          let height = 0
          this.heights = data.map(item => {
            height += item.height
            return height
          })
        }).exec()
      },
      playLrc (time) {
        if (this.lyrics.length === 0) return
        // 如果时长超过歌词时长，取最后一句歌词
        if (time > this.lyrics[this.lyrics.length - 1].time) {
          this.scrollTop = this.heights[this.heights.length - 1]
          return
        }
        // 取当前歌词
        const index = this.lyrics.findIndex(item => item.time >= time)
        if (index !== this.currentLrcIndex) {
          this.currentLrcIndex = index - 1
          this.scrollTop = this.heights[this.currentLrcIndex]
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
          this.$nextTick(() => {
            // 获取所有歌词scrollTop
            this.getAllNodeHeight()
            // 播放歌词
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
          const reg = /^\[\d{1,2}:\d{1,2}.\d{1,3}$/
          const arr = str.split(']')
          // 匹配歌词时间
          const timeArr = arr.filter(item => reg.test(item))
          // 取出歌词
          const lrc = arr.find(item => !reg.test(item))
          for (const timeStr of timeArr) {
            const arr = timeStr.split(/[\[:.]/)
            const m = parseInt(arr[1])
            const s = parseInt(arr[2])
            const ms = parseInt(arr[3])
            const time = (m * 60 + s) * 1000 + ms
            res.push({ time, text: lrc })
          }
        }
        // 按时间排序并返回
        return res.sort((a, b) => (a.time - b.time))
      }
    }
  }
</script>

<style lang="scss" scoped>
.lyric-wrapper {
  
  .lyric {
    padding: 0 24px;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    .lyric-item {
      // height: 48px;
      padding: 16px 0;
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
