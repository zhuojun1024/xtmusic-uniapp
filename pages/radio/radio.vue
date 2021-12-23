<template>
  <view>
    <view class="search-wrapper">
      <uni-search-bar
        v-model="keyword"
        placeholder="搜索电台"
        @confirm="search"
      />
      <scroll-view
        scroll-y
        :style="{ height: `calc(100vh - ${ 108 + excludeHeight }px)` }"
        @scrolltolower="loadNext"
      >
        <view
          v-for="item of data"
          :key="item.id"
          class="radio-list-item"
          @click="toProgram(item)"
        >
          <view>
            <image lazy-load :src="item.picUrl ? item.picUrl + '?param=128y128' : ''" />
          </view>
          <view>
            <view>{{ item.name }}</view>
            <view>{{ item.programCount }} 个节目</view>
          </view>
        </view>
      </scroll-view>
    </view>
    <play-control />
  </view>
</template>

<script>
  import api from '@/api/music.js'
  export default {
    data () {
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
      },
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      }
    },
    onLoad () {
      this.cloudSearch()
    },
    methods: {
      toProgram (record) {
        uni.navigateTo({
          url: `/pages/radio-program-list/radio-program-list?id=${record.id}`
        })
      },
      loadNext () {
        if (this.loading || this.offset * this.limit >= this.total) return
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
          type: 1009,
          keywords: this.keyword || '热门电台',
          limit: this.limit,
          offset: this.offset * this.limit,
          timestamp
        }
        uni.showLoading({ title: '加载中' })
        this.loading = true
        api.cloudSearch(params).then(res => {
          const radios = res.result.djRadios || []
          this.data = this.data.concat(radios)
          this.total = res.result.djRadiosCount || 0
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.radio-list-item {
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
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    > view:last-child {
      color: #999999;
      font-size: 12px;
    }
  }
}
</style>
