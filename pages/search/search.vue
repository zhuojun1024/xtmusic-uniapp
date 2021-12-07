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
        <view
          v-for="(item, index) of data"
          :key="item.id"
          class="music-list-item"
          @click="playMusic(item)"
        >
          <view>{{ index + 1 }}</view>
          <view>
            <view>{{ item.name }}</view>
            <view>{{ item.ar }}</view>
          </view>
          <view>
            <uni-icons
              v-if="currentMusic.id === item.id"
              type="sound"
              size="24"
              color="#EA2000"
            />
          </view>
        </view>
      </scroll-view>
    </view>
    <play-control />
  </view>
</template>

<script>
  import api from './api'
  import { SET_CURRENT_MUSIC, SET_CURRENT_MUSIC_LIST } from '@/store/mutations-types.js'
  export default {
    data() {
      return {
        keyword: undefined,
        data: [],
        offset: 0,
        limit: 30,
        total: 0
      }
    },
    computed: {
      currentMusic () {
        return this.$store.getters.currentMusic
      }
    },
    onShow () {
      if (this.data.length === 0) {
        this.cloudSearch()
      }
    },
    methods: {
      playMusic (music) {
        this.$store.commit(SET_CURRENT_MUSIC, music)
        this.$store.commit(SET_CURRENT_MUSIC_LIST, this.data)
      },
      loadNext () {
        this.offset++
        this.cloudSearch()
      },
      search () {
        this.offset = 0
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

<style lang="scss">
.search-wrapper {
  scroll-view {
    height: calc(100vh - 202px);
  }
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
        width: calc(100% - 96px);
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
        width: 48px;
        text-align: center;
      }
    }
  }
}
</style>
