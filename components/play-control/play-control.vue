<template>
  <view>
    <view class="play-control-placeholder" />
    <view class="play-control-wrapper">
      <view>
        <image :src="coverImgUrl" />
      </view>
      <view @click="toControlPage">
        <view>{{ currentTime || '00:00' }} / {{ duration || '00:00' }}</view>
        <view>{{ currentMusic.ar || '歌手' }} - {{ currentMusic.name || '歌曲标题' }}</view>
      </view>
      <view>
        <uni-icons
          size="32"
          color="white"
          custom-prefix="iconfont"
          :type="paused ? 'icon-play-circle' : 'icon-pause-circle'"
          @click="playPause"
        />
        <uni-icons
          size="32"
          color="white"
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
  width: 100%;
  position: fixed;
  left: 0;
  // #ifndef H5
  bottom: 0;
  // #endif
  // #ifdef H5
  bottom: 50px;
  // #endif
  color: white;
  background-color: #666666;
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
        background-color: white;
      }
    }
    &:nth-child(2) {
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
    top: -3px;
    left: 0;
    height: 3px;
    background-color: #EA2000;
  }
}
</style>
