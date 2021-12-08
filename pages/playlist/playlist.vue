<template>
  <view>
    <view>
      <view
        v-for="item of data"
        :key="item.id"
        class="playlist-item"
        @click="toTrack(item.id)"
      >
        <view>
          <image lazy-load :src="item.coverImgUrl ? item.coverImgUrl + '?param=128y128' : ''" />
        </view>
        <view>
          <view>{{ item.name }}</view>
          <view>{{ item.trackCount }} 首</view>
        </view>
      </view>
    </view>
    <play-control />
  </view>
</template>

<script>
  import api from './api.js'
  export default {
    data() {
      return {
        data: []
      }
    },
    computed: {
      userInfo () {
        return this.$store.getters.userInfo
      }
    },
    onShow () {
      if (this.data.length === 0) {
        this.getPlayList()
      }
    },
    methods: {
      toTrack (id) {
        uni.navigateTo({
          url: '/pages/playlist-track/playlist-track?id=' + id
        })
      },
      getPlayList () {
        const timestamp = new Date().getTime()
        const params = {
          uid: this.userInfo.userId,
          timestamp
        }
        uni.showLoading({ title: '加载中' })
        api.getPlayList(params).then(res => {
          this.data = res.playlist
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '获取歌单失败：' + e
          })
          console.error('获取歌单失败：', e)
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.playlist-item {
  padding: 8px;
  border-bottom: 1px solid #efefef;
  > view {
    display: inline-block;
    vertical-align: middle;
  }
  > view:first-child {
    width: 64px;
    height: 64px;
    image {
      width: 100%;
      height: 100%;
    }
  }
  > view:last-child {
    width: calc(100% - 80px);
    padding-left: 8px;
    font-size: 14px;
    > view {
      height: 24px;
      line-height: 24px;
    }
    > view:last-child {
      color: #999999;
      font-size: 12px;
    }
  }
}
</style>
