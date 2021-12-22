<template>
  <view>
    <view class="cloud-size">
      <view
        class="precent"
        :style="{ width: (size / maxSize * 100) + '%' }"
      />
      <text>{{ size }}GB / {{ maxSize }}GB</text>
    </view>
    <view class="search-wrapper">
      <play-list-track
        show-add
        :height="`calc(100vh - ${ 108 + excludeHeight }px)`"
        :data="data"
        @scrolltolower="loadNext"
      />
    </view>
    <play-control />
  </view>
</template>

<script>
  import api from './api.js'
  export default {
    data () {
      return {
        data: [],
        offset: 0,
        limit: 30,
        total: 0,
        loading: false,
        size: 0,
        maxSize: 1
      }
    },
    computed: {
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      }
    },
    onLoad () {
      this.getUserCloud()
    },
    methods: {
      loadNext () {
        if (this.loading || (this.offset + 1) * this.limit >= this.total) return
        this.offset++
        this.getUserCloud()
      },
      search () {
        this.offset = 0
        this.data = []
        this.getUserCloud()
      },
      getUserCloud () {
        const timestamp = new Date().getTime()
        const params = {
          limit: this.limit,
          offset: this.offset * this.limit,
          timestamp
        }
        uni.showLoading({ title: '加载中' })
        this.loading = true
        api.getUserCloud(params).then(res => {
          const data = res.data || []
          this.data = this.data.concat(data.map(item => item.simpleSong).map(item => {
            item.ar = item.ar.filter(item => item.name).map(item => item.name).join('、')
            item.noCopyrightRcmd = null
            return item
          }))
          this.total = res.count || 0
          if (res.size) {
            this.size = (res.size / 1024 / 1024 / 1024).toFixed(1)
          }
          if (res.maxSize) {
            this.maxSize = (res.maxSize / 1024 / 1024 / 1024).toFixed(1)
          }
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '获取云盘歌曲失败：' + e
          })
          console.error('获取云盘歌曲失败：', e)
        }).finally(() => {
          uni.hideLoading()
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cloud-size {
    height: 32px;
    line-height: 32px;
    position: relative;
    background-color: #aaaaaa;
    margin: 12px;
    border-radius: 32px;
    overflow: hidden;
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.2);
    .precent {
      position: absolute;
      width: 50%;
      height: 100%;
      background-color: #EA2000;
    }
    text {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      color: white;
      text-align: center;
      font-size: 16px;
    }
  }
</style>
