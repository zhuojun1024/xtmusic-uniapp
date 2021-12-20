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
          <text>加入歌单</text>
        </view>
        <scroll-view scroll-y>
          <view
            v-for="item of data"
            :key="item.id"
            class="play-list-item"
            @click="addToPlayList(item.id)"
          >
            <view>
              <text>{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import api from '@/api/music.js'
  export default {
    name:"play-list",
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      trackId: {
        type: Number,
        default: undefined
      }
    },
    data () {
      return {
        data: []
      }
    },
    computed: {
      userInfo () {
        return this.$store.getters.userInfo
      }
    },
    watch: {
      visible (newVal) {
        if (newVal) {
          if (this.data.length === 0) {
            this.getPlayList()
          }
          this.$refs.popup.open()
        } else {
          this.$refs.popup.close()
        }
      },
      userInfo () {
        this.getPlayList()
      }
    },
    methods: {
      addToPlayList (id) {
        const timestamp = new Date().getTime()
        const params = {
          op: 'add',
          pid: id,
          tracks: String(this.trackId),
          timestamp
        }
        uni.showLoading({ title: '加入歌单中' })
        api.updatePlayListTracks(params).then(res => {
          uni.showToast({ icon: 'success', title: '操作成功' })
          this.$emit('change', false)
        }).catch(e => {
          uni.showToast({ icon: 'error', title: '加入歌单失败：' + e })
          console.error('加入歌单失败：', e)
        }).finally(() => {
          uni.hideLoading()
        })
      },
      getPlayList () {
        if (!this.userInfo.userId) return
        const timestamp = new Date().getTime()
        const params = {
          uid: this.userInfo.userId,
          timestamp
        }
        api.getPlayList(params).then(res => {
          const data = res.playlist
          this.data = data.filter(item => item.creator.userId === this.userInfo.userId)
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '获取歌单失败：' + e
          })
          console.error('获取歌单失败：', e)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.popup-wrapper {
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
        }
      }
    }
  }
}
</style>
