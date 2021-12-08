<template>
  <view>
    <play-list-track :data="data" />
  </view>
</template>

<script>
  import api from './api'
  export default {
    data() {
      return {
        id: undefined,
        data: []
      }
    },
    onLoad (option) {
      this.id = option.id
      this.getPlayListTrack()
    },
    methods: {
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
