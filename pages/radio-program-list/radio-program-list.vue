<template>
  <view>
    <scroll-view
      scroll-y
      :style="{ height: `calc(100vh - ${ excludeHeight }px)` }"
      @scrolltolower="loadNext"
    >
      <view
        v-for="(item, index) of data"
        :key="item.id"
        :class="{ 'music-list-item': true }"
        @click="playMusic(item)"
      >
        <view>{{ index + 1 }}</view>
        <view>
          <view>{{ item.name }}</view>
          <view>{{ item.ar || '未知主持人' }}</view>
        </view>
        <view>
          <uni-icons
            v-if="currentMusic.id === item.id"
            type="sound"
            size="24"
            color="#EA2000"
            class="uni-icons"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import api from './api.js'
  import { SET_CURRENT_MUSIC, SET_CURRENT_MUSIC_LIST } from '@/store/mutations-types.js'
  export default {
    data() {
      return {
        id: undefined,
        data: [],
        offset: 0,
        limit: 30,
        total: 0,
        loading: false
      }
    },
    computed: {
      currentMusic () {
        return this.$store.getters.currentMusic
      },
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      }
    },
    onLoad (option) {
      this.id = option.id
      this.getRadioProgram()
    },
    methods: {
      playMusic (music) {
        if (music.id === this.currentMusic.id) {
          uni.navigateTo({ url: '/pages/control/control' })
        } else {
          this.$store.dispatch(SET_CURRENT_MUSIC, music).then(() => {
            this.$store.commit(SET_CURRENT_MUSIC_LIST, this.data)
          })
        }
      },
      loadNext () {
        if (this.loading || this.offset * this.limit >= this.total) return
        this.offset += 1
        this.getRadioProgram()
      },
      getRadioProgram () {
        const timestamp = new Date().getTime()
        const params = {
          rid: this.id,
          limit: this.limit,
          offset: this.offset * this.limit,
          timestamp
        }
        uni.showLoading({ title: '加载中' })
        this.loading = true
        api.getRadioProgram(params).then(res => {
          const programs = res.programs || []
          this.data = this.data.concat(programs.map(item => {
            const record = item.mainSong
            // 不同字段处理
            record.al = record.album
            delete record.album
            record.ar = item.dj.nickname
            delete record.artists
            return record
          }))
          this.total = res.count
        }).catch(e => {
          uni.showToast({
            icon: 'error',
            title: '加载电台节目失败：' + e
          })
          console.error('加载电台节目失败：', e)
        }).finally(() => {
          uni.hideLoading()
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.music-list-item {
  border-bottom: 1px solid #efefef;
  padding: 4px 0;
  > view {
    display: inline-block;
    vertical-align: middle;
    &:first-child {
      width: 48px;
      color: #999999;
      text-align: center;
    }
    &:nth-child(2) {
      width: calc(100% - 128px);
      line-height: 1.5;
      font-size: 14px;
      view {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      view:last-child {
        color: #999999;
        font-size: 12px;
      }
    }
    &:nth-child(3) {
      width: 60px;
      padding-right: 20px;
      text-align: right;
      .uni-icons {
        display: inline-block;
        vertical-align: middle;
        &:last-child {
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
