<template>
  <view>
    <view
      v-for="(item, index) of data"
      :key="item.id"
      :class="{ 'music-list-item': true, disabled: item.st === -200 }"
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
  </view>
</template>

<script>
  import { SET_CURRENT_MUSIC, SET_CURRENT_MUSIC_LIST } from '@/store/mutations-types.js'
  export default {
    name:"play-list-track",
    props: {
      data: {
        type: Array,
        default: () => ([])
      }
    },
    computed: {
      currentMusic () {
        return this.$store.getters.currentMusic
      }
    },
    methods: {
      playMusic (music) {
        if (music.st === -200) {
          uni.showToast({
            icon: 'error',
            title: '该音乐无版权'
          })
        } else {
          this.$store.dispatch(SET_CURRENT_MUSIC, music).then(() => {
            this.$store.commit(SET_CURRENT_MUSIC_LIST, this.data)
          })
        }
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
      width: calc(100% - 96px);
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
      width: 48px;
      text-align: center;
    }
  }
}
.music-list-item.disabled {
  color: #999999;
  opacity: 0.5;
}
</style>
