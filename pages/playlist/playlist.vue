<template>
  <view>
    <view>
      <uni-search-bar
        v-model="keyword"
        placeholder="搜索歌单"
        @confirm="search"
      />
      <scroll-view
        scroll-y
        @scrolltolower="loadNext"
      >
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
      </scroll-view>
    </view>
    <play-control />
  </view>
</template>

<script>
  import api from './api.js'
  import globalApi from '@/api/music.js'
  export default {
    data() {
      return {
        keyword: undefined,
        data: [],
        offset: 0,
        limit: 30,
        total: 0,
        loading: false
      }
    },
    computed: {
      userInfo () {
        return this.$store.getters.userInfo
      }
    },
    onLoad () {
      this.getPlayList()
    },
    methods: {
      loadNext () {
        if (this.loading || !this.keyword || this.offset * this.limit >= this.total) return
        this.offset += 1
        this.cloudSearch()
      },
      search () {
        if (!this.keyword) {
          this.getPlayList()
        } else {
          this.offset = 0
          this.data = []
          this.cloudSearch()
        }
      },
      cloudSearch () {
        const timestamp = new Date().getTime()
        const params = {
          type: 1000,
          keywords: this.keyword,
          limit: this.limit,
          offset: this.offset * this.limit,
          timestamp
        }
        uni.showLoading({ title: '加载中' })
        this.loading = true
        globalApi.cloudSearch(params).then(res => {
          const playlists = res.result.playlists || []
          this.data = this.data.concat(playlists)
          this.total = res.result.playlistCount || 0
          console.log(res)
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '搜索失败：' + e
          })
          console.error('搜索失败：', e)
        }).finally(() => {
          uni.hideLoading()
          this.loading = false
        })
      },
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
scroll-view {
  // #ifdef H5
  height: calc(100vh - 202px);
  // #endif
  // #ifndef H5
  height: calc(100vh - 108px);
  // #endif
}
.playlist-item {
  padding: 8px;
  border-bottom: 1px solid #efefef;
  > view {
    display: inline-block;
    vertical-align: middle;
  }
  > view:first-child {
    width: 40px;
    height: 40px;
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
