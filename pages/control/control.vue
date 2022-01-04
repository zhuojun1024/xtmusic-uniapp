<template>
  <view
    class="control-wrapper"
    :style="{
      height: `calc(100vh - ${excludeHeight}px)`,
      backgroundColor: current === 0 ? '#555555' : '#000000'
    }"
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
      backgroundColor="transparent"
      :border="false"
      @clickLeft="back"
    >
      <view class="tab">
        <text
          :class="{ current: current === 0 }"
          @click="handleCurrentChange(0)"
        >
          歌曲
        </text>
        <text class="divider" />
        <text
          :class="{ current: current === 1 }"
          @click="handleCurrentChange(1)"
        >
          歌词
        </text>
      </view>
    </uni-nav-bar>
    <swiper
      class="swiper-box"
      duration="300"
      :current="current"
      :style="{ height: `calc(100vh - ${excludeHeight}px)` }"
      @change="e => handleCurrentChange(e.detail.current)"
    >
      <swiper-item class="swiper-item">
        <view class="control-content">
          <view class="cover-wrapper">
            <view class="pic">
              <image :src="picUrl" />
            </view>
            <view class="music-info">
              <view>
                <text-scroll
                  class="music-name"
                  :text="currentMusic.name || '歌曲标题'"
                />
                <view class="singer-name">{{ currentMusic.ar || '歌手' }}</view>
              </view>
              <view>
                <uni-icons
                  v-if="likeListIds.includes(currentMusic.id)"
                  type="heart-filled"
                  size="32"
                  color="#EA2000"
                  class="uni-icons"
                  @click="updateLike(false)"
                />
                <uni-icons
                  v-else
                  type="heart"
                  size="32"
                  color="rgba(255, 255, 255, 0.5)"
                  class="uni-icons"
                  @click="updateLike(true)"
                />
              </view>
            </view>
          </view>
          <view class="progress-bar">
            <slider
              class="slider-bar-wrapper"
              block-size="12"
              activeColor="white"
              backgroundColor="rgba(255, 255, 255, 0.35)"
              :value="precent"
              @changing="handleChanging"
              @change="handleChange"
            />
            <view class="time">
              <text>{{ currentTime || '00:00' }}</text>
              <text>{{ duration || '00:00' }}</text>
            </view>
          </view>
          <view class="play-control">
            <uni-icons
              class="uni-icons"
              size="24"
              color="rgba(255, 255, 255, 0.5)"
              custom-prefix="iconfont"
              :type="playModeIcon"
              @click="switchPlayMode"
            >
              播放模式
            </uni-icons>
            <uni-icons
              class="uni-icons"
              size="24"
              color="white"
              custom-prefix="iconfont"
              type="icon-previous"
              @click="playPrev"
            >
              上一首
            </uni-icons>
            <uni-icons
              class="uni-icons"
              size="64"
              color="white"
              custom-prefix="iconfont"
              :type="paused ? 'icon-play-circle' : 'icon-pause-circle'"
              @click="playPause"
            >
              暂停/播放
            </uni-icons>
            <uni-icons
              class="uni-icons"
              size="24"
              color="white"
              custom-prefix="iconfont"
              type="icon-next"
              @click="playNext"
            >
              下一首
            </uni-icons>
            <uni-icons
              class="uni-icons"
              size="24"
              color="rgba(255, 255, 255, 0.5)"
              custom-prefix="iconfont"
              type="icon-playlist"
              @click="visible = true"
            >
              播放列表
            </uni-icons>
          </view>
        </view>
      </swiper-item>
      <swiper-item class="swiper-item">
        <lyric :height="`calc(100vh - 44px - ${excludeHeight}px)`" />
      </swiper-item>
    </swiper>
    <play-list
      :visible="visible"
      @change="v => visible = v"
    />
  </view>
</template>

<script>
  import {
    SET_CURRENT_TIME,
    PLAY_PAUSE,
    PLAY_PREV,
    PLAY_NEXT,
    SET_PLAY_MODE,
    PLAY_MODE_SEQUE,
    PLAY_MODE_REPEAT_ONE,
    PLAY_MODE_SHUFFLE,
    ADD_LIKE_LIST_ID,
    DEL_LIKE_LIST_ID
  } from '@/store/mutations-types.js'
  import { formatTime } from '@/utils/util.js'
  import lyric from './components/lyric.vue'
  import api from './api.js'
  export default {
    components: { lyric },
    data () {
      return {
        visible: false,
        current: 0,
        changing: false,
        changingValue: 0,
        timer: undefined,
        playModeOptions: [
          { name: '顺序播放', value: PLAY_MODE_SEQUE, icon: 'icon-repeat' },
          { name: '单曲循环', value: PLAY_MODE_REPEAT_ONE, icon: 'icon-repeatOnce' },
          { name: '随机播放', value: PLAY_MODE_SHUFFLE, icon: 'icon-shuffle' }
        ]
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
      playModeIcon () {
        const playMode = this.$store.getters.playMode
        const option = this.playModeOptions.find(item => item.value === playMode)
        return option.icon
      },
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      },
      likeListIds () {
        return this.$store.getters.likeListIds
      }
    },
    watch: {
      current (newVal) {
        // 屏幕常亮判断
        this.setKeepScreenOn(newVal === 1)
      }
    },
    onShow () {
      // 屏幕常亮
      if (this.current === 1) {
        this.setKeepScreenOn(true)
      }
    },
    onHide () {
      // 取消屏幕常亮
      this.setKeepScreenOn(false)
    },
    onUnload () {
      // 取消屏幕常亮
      this.setKeepScreenOn(false)
    },
    methods: {
      setKeepScreenOn (keepScreenOn) {
        // #ifndef H5
        uni.setKeepScreenOn({ keepScreenOn })
        // #endif
      },
      updateLike (like) {
        if (!this.currentMusic.id) return
        const timestamp = new Date().getTime()
        const params = {
          id: this.currentMusic.id,
          like,
          timestamp
        }
        api.updateLike(params).then(res => {
          const operation = like ? ADD_LIKE_LIST_ID : DEL_LIKE_LIST_ID
          this.$store.commit(operation, this.currentMusic.id)
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '请求失败'
          })
          console.error('喜欢/取消喜欢音乐失败：', e)
        })
      },
      switchPlayMode () {
        const playMode = this.$store.getters.playMode
        const index = this.playModeOptions.findIndex(item => item.value === playMode)
        let option
        if (index < this.playModeOptions.length - 1) {
          option = this.playModeOptions[index + 1]
        } else {
          option = this.playModeOptions[0]
        }
        this.$store.commit(SET_PLAY_MODE, option.value)
        uni.showToast({
          icon: 'none',
          title: option.name
        })
      },
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
  background-color: black;
  position: relative;
  overflow: hidden;
  background-color: #555555;
  transition: background-color 0.3s;
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
    // /deep/.uni-nav-bar-text {
    //   font-size: 16px;
    //   font-weight: 600;
    // }
    /deep/.uni-navbar__header-btns-right {
      width: 60px;
      padding-right: 0;
    }
    .tab {
      width: 100%;
      font-size: 15px;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
      text {
        margin: 0 6px;
        display: inline-block;
        vertical-align: middle;
      }
      .current {
        color: white;
      }
      .divider {
        height: 8px;
        border-right: 1px solid rgba(255, 255, 255, 0.6);
      }
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
    .cover-wrapper {
      // 减去导航栏、进度条、播放控制栏的高度和margin
      $cover_height: calc(100vh - 212px - constant(safe-area-inset-bottom));
      $cover_height: calc(100vh - 212px - env(safe-area-inset-bottom));
      height: $cover_height;
      .pic {
        text-align: center;
        image {
          // 减去导航栏、进度条、播放控制栏、歌曲信息的高度和margin
          $image_max_size: calc(100vh - 346px - constant(safe-area-inset-bottom));
          $image_max_size: calc(100vh - 346px - env(safe-area-inset-bottom));
          width: calc(100vw - 64px);
          max-width: $image_max_size;
          height: calc(100vw - 64px);
          max-height: $image_max_size;
          margin: 24px 0;
          border-radius: 12px;
          background-color: #999999;
        }
      }
      .music-info {
        padding: 24px 32px;
        padding-top: 0;
        color: white;
        > view {
          display: inline-block;
          vertical-align: middle;
          &:first-child {
            width: calc(100% - 48px);
            .music-name {
              font-size: 24px;
              font-weight: 600;
              line-height: 24px;
            }
            .singer-name {
              color: rgba(255, 255, 255, 0.65);
              margin-top: 12px;
              font-size: 15px;
              line-height: 15px;
            }
          }
          &:last-child {
            width: 48px;
            line-height: 1;
            text-align: right;
          }
        }
      }
    }
    .progress-bar {
      height: 40px;
      color: white;
      padding: 0 32px;
      box-sizing: border-box;
      .slider-bar-wrapper {
        margin: 0;
      }
      .time {
        font-size: 14px;
        text {
          width: 50%;
          display: inline-block;
          // border: 1px solid red;
          &:last-child {
            text-align: right;
          }
        }
      }
    }
    .play-control {
      width: calc(100% - 64px);
      height: 72px;
      line-height: 72px;
      margin: 0 32px;
      text-align: center;
      .uni-icons {
        width: calc((100% - 80px) / 3);
        height: 100%;
        display: inline-block;
        vertical-align: middle;
        &:first-child {
          text-align: left;
        }
        &:last-child {
          text-align: right;
        }
        &:first-child, &:last-child {
          width: 40px;
        }
      }
    }
  }
}
</style>
