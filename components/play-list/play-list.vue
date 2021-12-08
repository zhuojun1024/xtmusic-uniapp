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
        >
          <view
            v-for="(item, index) of data"
            :key="item.id"
            class="play-list-item"
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
    computed: {
      data () {
        return this.$store.getters.currentMusicList
      },
      currentMusic () {
        return this.$store.getters.currentMusic
      }
    },
    watch: {
      visible (newVal) {
        if (newVal) {
          this.$refs.popup.open()
        } else {
          this.$refs.popup.close()
        }
      }
    },
    methods: {
      playMusic (music) {
        this.$store.dispatch(SET_CURRENT_MUSIC, music)
      }
    }
  }
</script>

<style lang="scss" scoped>
.popup-wrapper {
  z-index: 999;
  .popup-content {
    height: 60vh;
    .title-bar {
      height: 48px;
      line-height: 48px;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
    }
    scroll-view {
      height: calc(100% - 40px);
      .play-list-item {
        font-size: 14px;
        padding: 12px 12px;
        border-bottom: 1px solid #efefef;
        > view:first-child {
          display: inline-block;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          width: calc(100% - 32px);
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
  }
}
</style>
