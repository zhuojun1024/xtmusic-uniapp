<template>
  <view>
    <view
      :class="{ 'play-control-placeholder': true, 'safe-area': !isTabBar }"
    />
    <view
      :class="{ 'play-control-wrapper': true, 'safe-area': !isTabBar }"
      :style="{ bottom: excludeHeight + 'px' }"
    >
      <view>
        <div class="wrapper left">
          <div
            class="circle_progress left_circle"
            :style="{ transform: `rotate(${rotate.left}deg)` }"
          />
        </div>
        <div class="wrapper right">
          <div
            class="circle_progress right_circle"
            :style="{ transform: `rotate(${rotate.right}deg)` }"
          />
        </div>
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
          size="28"
          color="#515151"
          custom-prefix="iconfont"
          class="uni-icons"
          :type="paused ? 'icon-play-circle' : 'icon-pause-circle'"
          @click="playPause"
        />
        <uni-icons
          size="24"
          color="#515151"
          custom-prefix="iconfont"
          class="uni-icons"
          type="icon-playlist"
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
        return al.picUrl ? `${al.picUrl}?param=128y128` : ''
      },
      rotate () {
        // left: 225 ~ 405, right: 225 ~ 405
        const left =  225 + 180 * ((this.precent - 50) / 100 * 2)
        const right = 225 + 180 * (this.precent / 100 * 2)
        return {
          left: left < 225 ? 225 : left,
          right: right > 405 ? 405: right
        }
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
    &:nth-child(1) {
      width: 64px;
      height: 64px;
      margin-top: -24px;
      position: relative;
      image {
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        margin: 2px;
        border-radius: 100%;
        background-color: #efefef;
      }
      .wrapper {
        width: 32px;
        height: 64px;
        position: absolute;
        top: 0;
        overflow: hidden;
      }
      .right {
        right: 0;
      }
      .left {
        left: 0;
      }
      .circle_progress {
        width: 58px;
        height: 58px;
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        position: absolute;
        top: 0;
        transform: rotate(45deg);
      }
      .right_circle {
        border-top: 3px solid #EA2000;
        border-right: 3px solid #EA2000;
        right: 0;
        transform: rotate(45deg);
      }
      .left_circle {
        border-bottom: 3px solid #EA2000;
        border-left: 3px solid #EA2000;
        left: 0;
        transform: rotate(225deg);
      }
    }
    &:nth-child(2) {
      width: calc(100% - 144px);
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
    &:nth-child(3) {
      width: 70px;
      .uni-icons {
        width: 50%;
        display: inline-block;
        vertical-align: middle;
        &:first-child {
          text-align: left;
        }
        &:last-child {
          text-align: right;
        }
      }
    }
  }
}
</style>
