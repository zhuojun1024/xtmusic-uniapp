<template>
  <view>
    <uni-popup
      ref="popup"
      type="bottom"
      background-color="#f5f5f5"
      class="popup-wrapper"
      @change="e => $emit('change', e.show)"
    >
      <view class="popup-content">
        <view class="title-bar">
          <text>播放列表</text>
        </view>
        <scroll-view
          scroll-y
          :scroll-top="scrollTop"
        >
          <view
            v-for="(item, index) of data"
            :key="item.id"
            :id="'l' + item.id"
            :class="{ 'play-list-item': true, disabled: item.st === -200 }"
            @click="playMusic(item)"
          >
            <view>
              <text>{{ item.name }}</text>
              <text>- {{ item.ar }}</text>
            </view>
            <uni-icons
              v-if="currentMusic.id === item.id"
              type="sound"
              size="24"
              color="#EA2000"
            />
          </view>
        </scroll-view>
        <view
          class="title-bar button-close"
          @click="$emit('change', false)"
        >
          关闭
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import { SET_CURRENT_MUSIC } from '@/store/mutations-types.js'
  export default {
    name:"play-list",
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        scrollTop: 0
      }
    },
    computed: {
      data () {
        return this.$store.getters.currentMusicList
      },
      currentMusic () {
        return this.$store.getters.currentMusic
      },
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      }
    },
    watch: {
      visible (newVal) {
        if (newVal) {
          this.$refs.popup.open()
          // 跳到正在播放的歌曲的位置
          this.$nextTick(() => {
            if (this.currentMusic.id) {
              const index = this.data.findIndex(item => item.id === this.currentMusic.id) - 2
              this.scrollTop = index * 49 + Math.random()
            }
          })
        } else {
          this.$refs.popup.close()
        }
      }
    },
    methods: {
      playMusic (music) {
        if (music.st === -200) {
          uni.showToast({
            icon: 'error',
            title: '该音乐无版权'
          })
        } else {
          this.$store.dispatch(SET_CURRENT_MUSIC, music)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.popup-wrapper {
  .popup-content {
    height: 70vh;
    .title-bar {
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    }
    scroll-view {
      height: calc(100% - 96px - constant(safe-area-inset-bottom));
      height: calc(100% - 96px - env(safe-area-inset-bottom));
      .play-list-item {
        height: 48px;
        line-height: 48px;
        font-size: 14px;
        padding: 0 12px;
        border-bottom: 1px solid #efefef;
        > view:first-child {
          display: inline-block;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          width: calc(100% - 40px);
          text:last-child {
            color: #999999;
            margin-left: 6px;
            font-size: 12px;
          }
        }
        .uni-icons {
          float: right;
        }
      }
    }
    .button-close {
      color: #333333;
      background-color: #efefef;
      font-weight: 500;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
  .play-list-item.disabled {
    color: #999999;
    opacity: 0.5;
  }
}
</style>
