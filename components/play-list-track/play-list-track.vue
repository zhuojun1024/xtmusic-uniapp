<template>
  <view>
    <scroll-view
      scroll-y
      :style="{ height }"
      @scrolltolower="$emit('scrolltolower')"
    >
      <view
        v-for="(item, index) of data"
        :key="item.id"
        :class="{ 'music-list-item': true, disabled: item.st === -200 || item.noCopyrightRcmd }"
        @click="playMusic(item)"
      >
        <view>{{ index + 1 }}</view>
        <view>
          <view>{{ item.name }}</view>
          <view>
            <uni-icons
              v-if="showLiked && likeListIds.includes(item.id)"
              type="heart-filled"
              size="12"
              color="#EA2000"
              style="margin-right: 4px;"
            />
            <text
              v-if="item.fee === 1"
              class="tag-vip"
            >
              VIP
            </text>
            <text>{{ item.ar || '未知歌手' }}</text>
          </view>
        </view>
        <view>
          <uni-icons
            v-if="currentMusic.id === item.id"
            type="sound"
            size="24"
            color="#EA2000"
            class="uni-icons"
          />
          <uni-icons
            v-if="showAdd"
            type="plusempty"
            size="20"
            color="#999999"
            class="uni-icons"
            @click.native.stop="showPlayList(item)"
          />
          <uni-icons
            v-if="showDel"
            type="closeempty"
            size="20"
            color="#999999"
            class="uni-icons"
            @click.native.stop="popupOpen(item)"
          />
        </view>
      </view>
      <slot />
    </scroll-view>
    <play-list-track-add
      v-if="showAdd"
      :visible="visible"
      :track-id="selectedMusicId"
      @change="v => visible = v"
    />
    <uni-popup
      ref="popup"
      type="dialog"
    >
      <uni-popup-dialog
        content="确定要将该歌曲从歌单中删除吗？"
        :duration="2000"
        :before-close="true"
        @close="popupClose"
        @confirm="popupConfirm"
      />
    </uni-popup>
  </view>
</template>

<script>
  import api from '@/api/music.js'
  import { SET_CURRENT_MUSIC, SET_CURRENT_MUSIC_LIST } from '@/store/mutations-types.js'
  export default {
    name:"play-list-track",
    props: {
      data: {
        type: Array,
        default: () => ([])
      },
      pId: {
        type: String,
        default: undefined
      },
      showAdd: {
        type: Boolean,
        default: false
      },
      showDel: {
        type: Boolean,
        default: false
      },
      showLiked: {
        type: Boolean,
        default: true
      },
      height: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        selectedMusicId: undefined,
        visible: false
      }
    },
    computed: {
      currentMusic () {
        return this.$store.getters.currentMusic
      },
      likeListIds () {
        return this.$store.getters.likeListIds
      }
    },
    watch: {
      visible (newVal) {
        if (newVal) {
          uni.hideTabBar({ animation: true })
        } else {
          uni.showTabBar({ animation: true })
        }
      }
    },
    methods: {
      copyrighted (music) {
        if (music.st === -200 || music.noCopyrightRcmd) {
          uni.showToast({
            icon: 'error',
            title: '该音乐无版权'
          })
          return false
        }
        return true
      },
      popupClose () {
        this.$refs.popup.close()
      },
      popupConfirm () {
        this.$refs.popup.close()
        const timestamp = new Date().getTime()
        const params = {
          op: 'del',
          pid: this.pId,
          tracks: String(this.selectedMusicId),
          timestamp
        }
        uni.showLoading({ title: '删除中' })
        api.updatePlayListTracks(params).then(res => {
          uni.showToast({ icon: 'success', title: '操作成功' })
          this.$emit('refresh')
        }).catch(e => {
          uni.showToast({ icon: 'error', title: '删除失败：' + e })
          console.error('删除失败：', e)
        }).finally(() => {
          uni.hideLoading()
        })
      },
      popupOpen (music) {
        this.selectedMusicId = music.id
        this.$refs.popup.open()
      },
      showPlayList (music) {
        if (!this.copyrighted(music)) return
        this.selectedMusicId = music.id
        this.visible = true
      },
      playMusic (music) {
        if (!this.copyrighted(music)) return
        if (music.id === this.currentMusic.id) {
          uni.navigateTo({ url: '/pages/control/control' })
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
        .tag-vip {
          line-height: 1;
          display: inline-block;
          padding: 0 4px;
          color: #EA2000;
          border: 1px solid #EA2000;
          border-radius: 3px;
          transform-origin: 0;
          transform: scale(0.7);
        }
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
.music-list-item.disabled {
  color: #999999;
  > view:not(:last-child) {
    opacity: 0.5;
  }
}
</style>
