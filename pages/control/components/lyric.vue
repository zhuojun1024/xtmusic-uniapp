<template>
  <view class="lyric-wrapper">
    <scroll-view
      scroll-y
      scroll-with-animation
      class="lyric"
      :style="{ height }"
      :scroll-top="scrollTop"
      @scroll="handleScrollChange"
    >
      <view class="lyric-placeholder-top" />
      <view v-if="lyrics.length === 0" class="current">暂无歌词</view>
      <view
        v-else
        v-for="(item, index) of lyrics"
        :key="index"
        :class="{ 'lyric-item': true, current: index === currentLrcIndex }"
        :style="{ color: rolling && index === scrollLrcIndex ? 'white' : undefined }"
      >
        {{ item.text }}
      </view>
      <view class="lyric-placeholder-bottom" />
      <view
        v-show="rolling"
        class="scroll-time"
      >
        <uni-icons
          size="14"
          color="rgba(255, 255, 255, 0.65)"
          custom-prefix="iconfont"
          class="uni-icons"
          type="icon-play"
          @click="setCurrentTime()"
        />
        <view class="ref-line" />
        <text class="time">{{ scrollTime }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import api from '../api'
  import { formatTime } from '@/utils/util.js'
  import { SET_CURRENT_TIME } from '@/store/mutations-types.js'
  export default {
    props: {
      height: {
        type: String,
        default: '100vh'
      }
    },
    data() {
      return {
        rolling: false,
        lyrics: [],
        heights: [],
        currentLrcIndex: 0,
        scrollLrcIndex: 0,
        scrollTop: 0,
        timer: undefined
      }
    },
    computed: {
      currentMusic () {
        return this.$store.getters.currentMusic
      },
      scrollTime () {
        const ms = (this.lyrics[this.scrollLrcIndex] || {}).time || 0
        const s = ms / 1000
        return formatTime(s)
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
          this.$emit('change', undefined)
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
      }
    },
    methods: {
      setCurrentTime (index) {
        if (!this.rolling) return
        // 计算要跳到的时间并通知状态管理
        const selectedIndex = index || this.scrollLrcIndex
        const time = this.lyrics[selectedIndex].time / 1000 + 0.1
        this.$store.commit(SET_CURRENT_TIME, time)
        // 本地数据同步
        this.currentLrcIndex = selectedIndex
        this.scrollTop = this.heights[this.currentLrcIndex]
        // 取消滚动状态
        this.rolling = false
      },
      handleScrollChange (e) {
        // 如果没有歌词, 不处理事件
        if (this.lyrics.length === 0) return
        // 判断是手动滚动的还是代码滚动的
        this.setRolling(e.detail.scrollTop)
        // 如果不是滚动状态, 不处理事件
        if (!this.rolling) return
        const scrollTop = e.detail.scrollTop
        if (scrollTop >= this.heights[this.heights.length - 1]) {
          this.scrollLrcIndex = this.heights.length - 1
        } else {
          const index = this.heights.findIndex(item => item > scrollTop)
          this.scrollLrcIndex = index === -1 ? 0 : index
        }
      },
      setRolling (scrollTop) {
        if (!(scrollTop < (this.scrollTop + 54 / 2) && scrollTop > (this.scrollTop - 54 / 2))) {
          clearTimeout(this.timer)
          this.rolling = true
          // 5秒后清除手动滚动状态
          this.timer = setTimeout(() => {
            this.rolling = false
          }, 1000 * 5)
        }
      },
      handleTouchEnd () {
        if (this.lyrics.length === 0) return
      },
      getAllNodeHeight () {
        return new Promise(resolve => {
          const query = uni.createSelectorQuery().in(this)
          query.selectAll('.lyric-item').boundingClientRect(data => {
            // 保存所有歌词scrollTop
            let height = 0
            this.heights = data.map(item => {
              height += item.height
              return height
            })
            resolve()
          }).exec()
        })
      },
      playLrc (time) {
        if (this.lyrics.length === 0) return
        // 如果时长超过歌词时长，取最后一句歌词
        if (time > this.lyrics[this.lyrics.length - 1].time) {
          this.currentLrcIndex = this.heights.length - 1
          if (!this.rolling) {
            this.scrollTop = this.heights[this.heights.length - 1]
          }
          return
        }
        // 取当前歌词
        const index = this.lyrics.findIndex(item => item.time >= time)
        if (index !== this.currentLrcIndex) {
          this.currentLrcIndex = index - 1
          if (!this.rolling) {
            this.scrollTop = this.heights[this.currentLrcIndex]
          }
        }
      },
      getLyric () {
        this.lyrics = []
        const timestamp = new Date().getTime()
        const params = { id: this.currentMusic.id, timestamp }
        api.getLyric(params).then(res => {
          this.lyrics = this.handleLyric((res.lrc || {}).lyric || '')
          this.$nextTick(() => {
            // 获取所有歌词scrollTop
            this.getAllNodeHeight().finally(() => {
              // 初始化歌词位置
              this.currentLrcIndex = 0
              this.scrollTop = 0
              // 播放歌词
              const currentTime = this.$store.getters.currentTime
              this.playLrc(currentTime * 1000)
            })
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
          if (!lrc) continue
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
  ::-webkit-scrollbar {
    width:0;
  }
  .lyric {
    position: relative;
    box-sizing: border-box;
    color: white;
    text-align: center;
    .lyric-item {
      min-height: 22px;
      padding: 16px 32px;
      opacity: 0.4;
      font-size: 16px;
      // transition: opacity .3s, font-size .3s; // 有性能问题
      &.current {
        opacity: 1;
        font-size: 20px;
      }
    }
    .lyric-placeholder-top {
      height: 40%;
    }
    .lyric-placeholder-bottom {
      height: 60%;
    }
    .scroll-time {
      position: fixed;
      top: calc(40% - 22px);
      color: rgba(255, 255, 255, 0.65);
      text-align: center;
      .uni-icons, .ref-line, .time {
        display: inline-block;
        vertical-align: middle;
      }
      .uni-icons {
        width: 32px;
      }
      .ref-line {
        width: calc(100vw - 88px);
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }
      .time {
        font-size: 14px;
        width: 56px;
      }
    }
  }
}
</style>
