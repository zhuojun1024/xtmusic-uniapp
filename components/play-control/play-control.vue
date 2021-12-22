<template>
  <view>
    <view
      :class="{ 'play-control-placeholder': true, 'safe-area': !isTabBar }"
    />
    <view
      :class="{ 'play-control-wrapper': true, 'safe-area': !isTabBar }"
      :style="{ bottom: excludeHeight + 'px' }"
    >
      <view
        class="progress-bar"
        :style="{ width: precent + '%' }"
      />
      <view>
        <image :src="coverImgUrl" />
      </view>
      <view @click="toControlPage">
        <view>
          <text>{{ currentMusic.name || '歌曲标题' }}</text>
          <text>-</text>
          <text>{{ currentMusic.ar || '歌手' }}</text>
        </view>
        <view>
          <text>{{ currentTime || '00:00' }}</text>
          <text>/</text>
          <text>{{ duration || '00:00' }}</text>
        </view>
      </view>
      <view>
        <uni-icons
          size="32"
          color="#515151"
          custom-prefix="iconfont"
          :type="paused ? 'icon-play-circle' : 'icon-pause-circle'"
          @click="playPause"
        />
        <uni-icons
          size="32"
          color="#515151"
          style="margin-left: 8px;"
          type="list"
          @click="visible = true"
        />
      </view>
    </view>
    <play-list
      :visible="visible"
      @change="v => visible = v"
    />
  </view>
</template>

<script>
  import { PLAY_PAUSE } from '@/store/mutations-types.js'
  import { formatTime } from '@/utils/util.js'
  export default {
    name:"play-control",
    props: {
      isTabBar: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        visible: false
      }
    },
    computed: {
      currentMusic () {
        return this.$store.getters.currentMusic
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
      },
      coverImgUrl () {
        const al = this.currentMusic.al || {}
        return al.picUrl ? `${al.picUrl}?param=64y64` : ''
      },
      excludeHeight () {
        const { windowBottom } = uni.getSystemInfoSync()
        return windowBottom || 0
      }
    },
    watch: {
      visible (newVal) {
        if (newVal) {
          uni.hideTabBar({ animation: true })
        } else {
          uni.showTabBar({ animation: true })
        }
      }
    },
    methods: {
      toControlPage () {
        uni.navigateTo({
          url: '/pages/control/control'
        })
      },
      playPause () {
        this.$store.commit(PLAY_PAUSE)
      }
    }
  }
</script>

<style lang="scss" scoped>
.play-control-placeholder, .play-control-wrapper {
  height: 40px;
  padding: 6px 8px;
}
.safe-area {
  padding-bottom: calc(6px + constant(safe-area-inset-bottom));
  padding-bottom: calc(6px + env(safe-area-inset-bottom));
}
.play-control-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  background-color: #fefefe;
  .progress-bar {
    height: 2px;
    position: absolute;
    top: -2px;
    left: 0;
    z-index: 1;
    background-color: #EA2000;
  }
  > view {
    display: inline-block;
    box-sizing: border-box;
    vertical-align: middle;
    position: relative;
    z-index: 2;
    &:nth-child(2) {
      width: 56px;
      height: 56px;
      margin-top: -16px;
      image {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        background-color: #efefef;
        border: 2px solid rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
      }
    }
    &:nth-child(3) {
      width: calc(100% - 136px);
      height: 40px;
      line-height: 20px;
      padding-left: 8px;
      font-size: 14px;
      view {
        height: 50%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      > view:first-child {
        > text {
          &:nth-child(2), &:nth-child(3) {
            font-size: 12px;
            color: #515151;
          }
          &:nth-child(2) {
            margin: 0 4px;
          }
        }
      }
      > view:last-child {
        font-size: 12px;
        color: #515151;
        > text {
          display: inline-block;
          &:nth-child(1), &:nth-child(3) {
            min-width: 36px;
          }
          &:nth-child(2) {
            margin-right: 4px;
          }
        }
      }
    }
    &:nth-child(4) {
      width: 80px;
      * {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
