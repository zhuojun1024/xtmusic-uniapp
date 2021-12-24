<template>
  <view>
    <play-list-track
      :height="`calc(100vh - ${ excludeHeight }px)`"
      :data="loadedData"
      :p-id="id"
      :show-add="type === 'search'"
      :show-del="type === 'user'"
      :show-liked="showLiked"
      @refresh="getPlayListTrack"
      @scrolltolower="onScrollToLower"
    >
      <play-control :is-tab-bar="false" />
    </play-list-track>
  </view>
</template>

<script>
  import api from './api'
  export default {
    data() {
      return {
        id: undefined,
        data: [],
        type: 'user',
        offset: 0,
        limit: 30,
        showLiked: true
      }
    },
    computed: {
      loadedData () {
        return this.data.slice(0, (this.offset + 1) * this.limit)
      },
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      }
    },
    onLoad (option) {
      // 保存参数
      this.id = option.id
      this.type = option.type
      this.showLiked = option.showLiked === 'true' ? true : false
      uni.setNavigationBarTitle({ title: option.name })
      // 请求歌单数据
      this.getPlayListTrack()
    },
    methods: {
      onScrollToLower () {
        if ((this.offset + 1) * this.limit < this.data.length) {
          this.offset++
        }
      },
      getPlayListTrack () {
        const timestamp = new Date().getTime()
        const params = { id: this.id, timestamp }
        uni.showLoading({ title: '加载中' })
        api.getPlayListTrack(params).then(res => {
          const privileges = res.privileges || []
          const songs = res.songs || []
          for (let i = 0; i < songs.length; i++) {
            songs[i].st = privileges[i].st
            songs[i].ar = songs[i].ar.map(item => item.name).join('、')
          }
          this.data = songs
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '获取歌单曲目失败：' + e
          })
          console.error('获取歌单曲目失败：', e)
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
