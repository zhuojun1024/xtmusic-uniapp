<template>
  <view>
    <view class="search-wrapper">
      <uni-search-bar
        v-model="keyword"
        placeholder="搜索歌曲"
        @confirm="search"
      />
      <scroll-view
        scroll-y
        @scrolltolower="loadNext"
      >
        <play-list-track :data="data" />
      </scroll-view>
    </view>
    <play-control />
  </view>
</template>

<script>
  import api from './api'
  export default {
    data () {
      return {
        keyword: undefined,
        data: [],
        offset: 0,
        limit: 30,
        total: 0
      }
    },
    onShow () {
      if (this.data.length === 0) {
        this.cloudSearch()
      }
    },
    methods: {
      loadNext () {
        this.offset++
        this.cloudSearch()
      },
      search () {
        this.offset = 0
        this.data = []
        this.cloudSearch()
      },
      cloudSearch () {
        const timestamp = new Date().getTime()
        const params = {
          keywords: this.keyword || '热门歌曲',
          limit: 30,
          offset: this.offset * 30,
          timestamp
        }
        uni.showLoading({ title: '加载中' })
        api.cloudSearch(params).then(res => {
          const songs = res.result.songs || []
          this.data = this.data.concat(songs.map(item => {
            item.ar = item.ar.map(item => item.name).join('、')
            return item
          }))
          this.total = res.result.songCount || 0
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '搜索失败：' + e
          })
          console.error('搜索失败：', e)
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.search-wrapper {
  scroll-view {
    // #ifdef MP-WEIXIN
    height: calc(100vh - 108px);
    // #endif
    // #ifndef MP-WEIXIN
    height: calc(100vh - 202px);
    // #endif
  }
}
</style>
