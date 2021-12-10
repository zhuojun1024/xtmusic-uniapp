<template>
  <view
    class="control-wrapper"
    :style="{ height: `calc(100vh - ${excludeHeight}px)` }"
  >
    <view class="pic">
      <image :src="picUrl" />
    </view>
    <view class="music-info">
      <view>{{ currentMusic.name || '歌曲标题' }}</view>
      <view>
        <text>{{ currentMusic.ar || '歌手' }}</text>
        <text
          class="lrc-button"
          @click="showLyric"
        >
          词
        </text>
      </view>
    </view>
    <view class="progress-bar">
      <text>{{ currentTime || '00:00' }}</text>
<!--      <slider-bar
        class="slider-bar-wrapper"
        :precent="precent"
        @change="handleChange"
      /> -->
      <slider
        class="slider-bar-wrapper"
        block-size="16"
        activeColor="#EA2000"
        :value="precent"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @changing="handleChanging"
        @change="handleChange"
      />
      <text>{{ duration || '00:00' }}</text>
    </view>
    <view class="play-control">
      <uni-icons
        class="uni-icons"
        size="48"
        color="white"
        custom-prefix="iconfont"
        type="icon-left-circle"
        @click="playPrev"
      />
      <uni-icons
        class="uni-icons"
        size="64"
        color="white"
        custom-prefix="iconfont"
        :type="paused ? 'icon-play-circle' : 'icon-pause-circle'"
        @click="playPause"
      />
      <uni-icons
        class="uni-icons"
        size="48"
        color="white"
        custom-prefix="iconfont"
        type="icon-right-circle"
        @click="playNext"
      />
    </view>
  </view>
</template>

<script>
  import { SET_CURRENT_TIME, PLAY_PAUSE, PLAY_PREV, PLAY_NEXT } from '@/store/mutations-types.js'
  import { formatTime } from '@/utils/util.js'
  export default {
    data () {
      return {
        changing: false,
        changingValue: 0
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
      currentTime () {
        if (this.changing) {
          return formatTime(this.$store.getters.duration * this.changingValue / 100)
        }
        return formatTime(this.$store.getters.currentTime)
      },
      duration () {
        return formatTime(this.$store.getters.duration)
      },
      precent () {
        if (this.changing) {
          return this.changingValue
        }
        const currentTime = this.$store.getters.currentTime || 0
        const duration = this.$store.getters.duration || 1
        return currentTime / duration * 100
      },
      paused () {
        return this.$store.getters.paused
      },
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      }
    },
    methods: {
      handleTouchStart () {
        this.changing = true
      },
      handleTouchEnd () {
        setTimeout(() => {
          this.changing = false
        }, 200)
      },
      handleChanging (e) {
        this.changingValue = e.detail.value
      },
      showLyric () {
        uni.navigateTo({ url: '/pages/lyric/lyric' })
      },
      handleChange (e) {
        const precent = e.detail.value
        const duration = this.$store.getters.duration || 0
        this.$store.commit(SET_CURRENT_TIME, duration * precent / 100)
      },
      playPause () {
        this.$store.commit(PLAY_PAUSE)
      },
      playPrev () {
        this.$store.dispatch(PLAY_PREV)
      },
      playNext () {
        this.$store.dispatch(PLAY_NEXT)
      }
    }
  }
</script>

<style lang="scss" scoped>
.control-wrapper {
  background-color: #666666;
  position: relative;
  .pic {
    width: 100vw;
    height: 100vw;
    padding: 24px;
    box-sizing: border-box;
    image {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      background-color: #999999;
    }
  }
  .music-info {
    padding: 0 24px;
    color: white;
    > view:first-child {
      font-size: 24px;
    }
    > view:last-child {
      margin-top: 8px;
      font-size: 14px;
      .lrc-button {
        padding: 0 4px;
        text-align: center;
        float: right;
        font-size: 16px;
        border: 1px solid white;
        margin-top: -4px;
      }
    }
  }
  .progress-bar {
    color: white;
    padding: 12px 24px;
    box-sizing: border-box;
    > text, > .slider-bar-wrapper {
      display: inline-block;
      vertical-align: middle;
    }
    > text {
      font-size: 14px;
      width: 40px;
      &:last-child {
        text-align: right;
      }
    }
    > .slider-bar-wrapper {
      width: calc(100% - 100px);
      margin: 10px;
    }
  }
  .play-control {
    width: 100%;
    position: absolute;
    bottom: 72px;
    text-align: center;
    .uni-icons {
      width: 30%;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
</style>
