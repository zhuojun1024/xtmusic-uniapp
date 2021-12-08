<template>
  <view class="control-wrapper">
    <view class="pic">
      <image :src="picUrl" />
    </view>
    <view class="music-info">
      <view>{{ currentMusic.name || '歌曲标题' }}</view>
      <view>{{ currentMusic.ar || '歌手' }}</view>
    </view>
    <view class="progress-bar">
      <text>{{ currentTime || '00:00' }}</text>
      <slider-bar
        class="slider-bar-wrapper"
        :precent="precent"
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
    data() {
      return {
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
        return formatTime(this.$store.getters.currentTime)
      },
      duration () {
        return formatTime(this.$store.getters.duration)
      },
      precent () {
        const currentTime = this.$store.getters.currentTime || 0
        const duration = this.$store.getters.duration || 1
        return currentTime / duration * 100
      },
      paused () {
        return this.$store.getters.paused
      }
    },
    methods: {
      handleChange (precent) {
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
  // #ifdef MP-WEIXIN
  height: 100vh;
  // #endif
  // #ifndef MP-WEIXIN
  height: calc(100vh - 44px);
  // #endif
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
    view:first-child {
      font-size: 24px;
    }
    view:last-child {
      margin-top: 8px;
      font-size: 14px;
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
      width: 48px;
      &:last-child {
        text-align: right;
      }
    }
    > .slider-bar-wrapper {
      width: calc(100% - 96px);
    }
  }
  .play-control {
    width: 100%;
    position: absolute;
    bottom: 72px;
    text-align: center;
    .uni-icons {
      display: inline-block;
      vertical-align: middle;
      margin: 0 24px;
    }
  }
}
</style>
