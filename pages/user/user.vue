<template>
  <view>
    <view class="user-wrapper">
      <image
        mode="aspectFill"
        :src="userInfo.backgroundUrl"
      />
      <view class="user-info view-container">
        <image :src="userInfo.avatarUrl" />
        <view class="user-name">
          <text>{{ userInfo.nickname || '用户名' }}</text>
          <image
            v-if="vipImage"
            mode="heightFix"
            :src="vipImage"
          />
        </view>
      </view>
      <view class="settings view-container">
        <view>
          <text>音质：</text>
          <uni-data-checkbox
            class="uni-data-checkbox"
            :value="toneQuality"
            :localdata="options.toneQuality"
            @change="handleToneQualityChange"
          />
        </view>
      </view>
      <view
        class="logout-button view-container"
        @click="logout"
      >
        退出登录
      </view>
    </view>
    <play-control />
  </view>
</template>

<script>
  import api from './api.js'
  import globalApi from '@/api/login.js'
  import { LOGIN_OUT, RESET_STATE, SET_TONE_QUALITY } from '@/store/mutations-types.js'
  export default {
    data () {
      return {
        vipImage: undefined,
        options: {
          toneQuality: [
            { text: '流畅', value: 128000 },
            { text: '标准', value: 192000 },
            { text: '高清', value: 320000 }
          ]
        }
      }
    },
    computed: {
      userInfo () {
        return this.$store.getters.userInfo
      },
      toneQuality () {
        return this.$store.getters.toneQuality
      }
    },
    onLoad () {
      this.getVipInfo()
    },
    methods: {
      handleToneQualityChange (e) {
        const value = e.detail.value
        this.$store.commit(SET_TONE_QUALITY, value)
        const option = this.options.toneQuality.find(item => item.value === value)
        const title = `已切换${option.text}(${value / 1000}kbps)音质`
        uni.showToast({ title })
      },
      getVipInfo () {
        api.getVipInfo().then(res => {
          const data = res.data || {}
          this.vipImage = data.redVipDynamicIconUrl2
        }).catch(e => {
          console.error('获取VIP信息失败：', e)
        })
      },
      logout () {
        uni.showModal({
          title: '提示',
          content: '确定要退出登录吗？',
          confirmColor: '#EA2000',
          success: res => {
            if (res.confirm) {
              globalApi.logout().finally(() => {
                // 移除用户信息
                this.$store.commit(LOGIN_OUT)
                // 移除cookie
                uni.removeStorageSync('cookie')
                // 重置播放状态
                this.$store.commit(RESET_STATE)
                // 前往登录页
                uni.reLaunch({
                  url: '/pages/login/login',
                })
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.user-wrapper {
  position: relative;
  > image {
    width: 100%;
    height: 200px;
  }
  .view-container {
    width: calc(100% - 48px);
    margin: 0 auto;
    background-color: white;
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.05);
    border-radius: 12px;
  }
  .user-info {
    height: 72px;
    padding-top: 48px;
    position: relative;
    top: -40px;
    left: 0;
    right: 0;
    > image {
      width: 80px;
      height: 80px;
      position: absolute;
      top: -40px;
      left: 0;
      right: 0;
      margin: 0 auto;
      border-radius: 40px;
      box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.1);
    }
    .user-name {
      margin-top: 4px;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      color: black;
      > image, > text {
        display: inline-block;
        vertical-align: middle;
      }
      > image {
        height: 16px;
        width: 40px;
        margin-left: 6px;
      }
    }
  }
  .settings {
    margin-top: -16px;
    > view {
      padding: 12px 24px;
      > text {
        font-size: 14px;
        margin-right: 8px;
      }
      > text, .uni-data-checkbox {
        display: inline-block;
        justify-content: center;
      }
    }
  }
  .logout-button {
    height: 40px;
    color: #EA2000;
    line-height: 40px;
    text-align: center;
    margin-top: 24px;
  }
}
</style>
