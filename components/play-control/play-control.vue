<template>
  <view>
    <view class="play-control-placeholder" />
    <view class="play-control-wrapper">
      <view>
        <image :src="coverImgUrl" />
      </view>
      <view>
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
        />
      </view>
    </view>
  </view>
</template>

<script>
  import { formatTime } from '@/utils/util.js'
  export default {
    name:"play-control",
    data() {
      return {
        
      };
    },
    computed: {
      bam () {
        return this.$store.getters.bam
      },
      currentMusic () {
        return this.$store.getters.currentMusic
      },
      currentTime () {
        return formatTime(this.$store.getters.currentTime)
      },
      duration () {
        return formatTime(this.$store.getters.duration)
      },
      paused () {
        return this.$store.getters.paused
      },
      coverImgUrl () {
        const al = this.currentMusic.al || {}
        return al.picUrl
      }
    },
    onShow () {
      console.log('play control show')
    },
    onHide () {
      console.log('play control hide')
    },
    methods: {
      playPause () {
        // 如果没有歌曲正在播放，跳过操作
        if (!this.currentMusic.id) return
        // 播放/暂停切换
        if (this.paused) {
          this.bam.play()
        } else {
          this.bam.pause()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.play-control-placeholder, .play-control-wrapper {
  width: 100%;
  height: 44px;
  padding: 4px 8px;
}
.play-control-wrapper {
  position: fixed;
  left: 0;
  bottom: 50px;
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
      padding-left: 8px;
      view {
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
}
</style>
