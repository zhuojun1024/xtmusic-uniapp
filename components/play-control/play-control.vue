<template>
  <view>
    <view class="play-control-placeholder" />
    <view
      class="play-control-wrapper"
      :style="{ bottom: excludeHeight + 'px' }"
    >
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
      <view
        class="progress-bar"
        :style="{ width: precent + '%' }"
      />
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
.play-control-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  background-color: #fefefe;
  > view {
    display: inline-block;
    box-sizing: border-box;
    vertical-align: middle;
    &:nth-child(1) {
      width: 40px;
      height: 40px;
      image {
        width: 100%;
        height: 100%;
        background-color: #efefef;
      }
    }
    &:nth-child(2) {
      width: calc(100% - 120px);
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
      width: 80px;
      * {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .progress-bar {
    position: absolute;
    top: -2px;
    left: 0;
    height: 2px;
    background-color: #EA2000;
  }
}
</style>
