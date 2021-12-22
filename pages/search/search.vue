<template>
  <view>
    <view class="search-wrapper">
      <uni-search-bar
        v-model="keyword"
        placeholder="搜索歌曲"
        :focus="!showPlayList"
        @confirm="search"
        @focus="onFocus"
        @input="onKeywordChange"
      />
      <view v-if="!showPlayList">
        <view
          v-if="!keyword"
          class="hot-detail"
        >
          <uni-tag
            v-for="(item,index) of hotWords"
            :key="index"
            :text="item"
            @click="onSearch(item)"
          />
        </view>
        <uni-list
          v-else
          class="search-words"
        >
          <uni-list-item
            clickable
            show-extra-icon
            :extra-icon="{ color: '#999999', size: '18', type: 'search' }"
            v-for="(word,index) of searchWords"
            :key="index"
            @click="onSearch(word)"
          >
            <view slot="body" style="font-size: 14px;">
              <text v-if="word.indexOf(keyword) > -1">
                {{ word.substr(0, word.indexOf(keyword)) }}
                <text style="color: #999999">{{ keyword }}</text>
                {{ word.substr(word.indexOf(keyword) + keyword.length) }}
              </text>
              <text v-else>{{ word }}</text>
            </view>
          </uni-list-item>
        </uni-list>
      </view>
      <play-list-track
        v-else="showPlayList"
        showAdd
        :height="`calc(100vh - ${ 108 + excludeHeight }px)`"
        :data="data"
        @scrolltolower="loadNext"
      />
    </view>
    <play-control />
  </view>
</template>

<script>
  import globalApi from '@/api/music.js'
  import api from './api.js'
  export default {
    data () {
      return {
        showPlayList: false,
        keyword: '',
        data: [],
        hotWords: [],
        searchWords: [],
        offset: 0,
        limit: 30,
        total: 0,
        loading: false,
        debounce: undefined
      }
    },
    computed: {
      excludeHeight () {
        const { windowTop, windowBottom } = uni.getSystemInfoSync()
        return (windowTop || 0) + (windowBottom || 0)
      }
    },
    onLoad () {
      this.getHotDetail()
    },
    methods: {
      onKeywordChange (keyword) {
        if (!keyword) return
        clearTimeout(this.debounce)
        this.debounce = setTimeout(() => {
          this.getSearchSuggest(keyword)
        }, 200)
      },
      getSearchSuggest (keyword) {
        const timestamp = new Date().getTime()
        const params = {
          keywords: keyword,
          type: 'mobile',
          timestamp
        }
        api.getSearchSuggest(params).then(res => {
          const data = res.result.allMatch || [{ keyword }]
          this.searchWords = data.map(item => item.keyword)
        }).catch(e => {
          console.error('获取搜索建议失败：', e)
        })
      },
      onFocus () {
        this.showPlayList = false
      },
      onSearch (item) {
        this.keyword = item
        this.search()
      },
      getHotDetail () {
        api.getHotDetail().then(res => {
          const data = res.data || []
          this.hotWords = data.map(item => item.searchWord)
        }).catch(e => {
          console.error('获取热搜列表失败：', e)
        })
      },
      loadNext () {
        if (this.loading || (this.offset + 1) * this.limit >= this.total) return
        this.offset++
        this.cloudSearch()
      },
      search () {
        if (!this.keyword) return
        this.offset = 0
        this.data = []
        this.showPlayList = true
        this.cloudSearch()
      },
      cloudSearch () {
        const timestamp = new Date().getTime()
        const params = {
          keywords: this.keyword || '热门歌曲',
          limit: this.limit,
          offset: this.offset * this.limit,
          timestamp
        }
        uni.showLoading({ title: '加载中' })
        this.loading = true
        globalApi.cloudSearch(params).then(res => {
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
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hot-detail {
    padding: 10px;
    /deep/.uni-tag {
      background-color: #999999;
      border: none;
      display: inline-block;
      margin: 6px;
      font-weight: normal;
    }
  }
</style>
