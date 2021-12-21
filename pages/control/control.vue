<template>
  <view
    class="control-wrapper"
    :style="{ height: `calc(100vh - ${excludeHeight}px)` }"
  >
    <view
      class="control-wrapper-bg"
      :style="{ backgroundImage: `url(${picUrlBg})` }"
    />
    <uni-nav-bar
      fixed
      status-bar
      class="uni-nav-bar"
      left-icon="left"
      color="white"
      title="播放控制"
      backgroundColor="transparent"
      :border="false"
      @clickLeft="back"
    />
    <view class="tab">
      <text
        :class="{ current: current === 0 }"
        @click="handleCurrentChange(0)"
      >
        歌曲
      </text>
      <text>|</text>
      <text
        :class="{ current: current === 1 }"
        @click="handleCurrentChange(1)"
      >
        歌词
      </text>
    </view>
    <swiper
      class="swiper-box"
      duration="300"
      :current="current"
      :style="{ height: `calc(100vh - 40px - ${excludeHeight}px)` }"
      @change="e => handleCurrentChange(e.detail.current)"
    >
      <swiper-item class="swiper-item">
        <view class="control-content">
          <view class="pic">
            <image :src="picUrl" />
          </view>
          <view class="music-info">
            <view>{{ currentMusic.name || '歌曲标题' }}</view>
            <view>{{ currentMusic.ar || '歌手' }}</view>
          </view>
          <view class="progress-bar">
            <text>{{ currentTime || '00:00' }}</text>
            <slider
              class="slider-bar-wrapper"
              block-size="16"
              activeColor="#EA2000"
              :value="precent"
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
      </swiper-item>
      <swiper-item class="swiper-item">
        <lyric :height="`calc(100vh - 40px - ${excludeHeight}px)`" />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  import { SET_CURRENT_TIME, PLAY_PAUSE, PLAY_PREV, PLAY_NEXT } from '@/store/mutations-types.js'
  import { formatTime } from '@/utils/util.js'
  import lyric from './components/lyric.vue'
  export default {
    components: { lyric },
    data () {
      return {
        current: 0,
        changing: false,
        changingValue: 0,
        timer: undefined
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
      picUrlBg () {
        const al = this.currentMusic.al || {}
        return al.picUrl ? `${al.picUrl}?param=1y1` : ''
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
      back () {
        uni.navigateBack({ delta: 1 })
      },
      handleCurrentChange (current) {
        this.current = current
      },
      handleChanging (e) {
        this.changingValue = e.detail.value
        this.changing = true
      },
      showLyric () {
        uni.navigateTo({ url: '/pages/lyric/lyric' })
      },
      handleChange (e) {
        const precent = e.detail.value
        const duration = this.$store.getters.duration || 0
        this.$store.commit(SET_CURRENT_TIME, duration * precent / 100)
        this.changing = false
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
  overflow-y: auto;
  background-color: #666666;
  position: relative;
  overflow: hidden;
  .main-canvas {
    width: 1px;
    height: 1px;
    position: fixed;
    opacity: 0;
  }
  .control-wrapper-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    opacity: 0.8;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .uni-nav-bar {
    color: white;
    /deep/.uni-icons {
      color: white !important;
    }
    /deep/.uni-nav-bar-text {
      font-size: 16px;
      font-weight: 600;
    }
    /deep/.uni-navbar__header-btns-right {
      width: 60px;
      padding-right: 0;
    }
  }
  .tab {
    position: relative;
    z-index: 2;
    height: 40px;
    // line-height: 48px;
    font-size: 16px;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    text {
      margin: 0 8px;
    }
    .current {
      color: white;
    }
  }
  .swiper-box {
    position: relative;
    z-index: 2;
    flex: 1;
  }
  .swiper-item {
    overflow-y: auto;
  }
  .control-content {
    .pic {
      width: 100vw;
      height: calc(100vw - 24px);
      padding: 24px;
      padding-top: 0;
      box-sizing: border-box;
      image {
        width: 100%;
        height: 100%;
        border-radius: 12px;
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
      height: 72px;
      text-align: center;
      margin-top: 32px;
      .uni-icons {
        width: 30%;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
